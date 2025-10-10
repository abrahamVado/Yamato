"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { LayoutGrid, LogOut, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { apiRequest, clearStoredToken } from "@/lib/api-client";

type ApiUser = {
  id?: number | string;
  name?: string | null;
  email?: string | null;
  profile?: { name?: string | null } | null;
  avatar_url?: string | null;
  profile_photo_url?: string | null;
};

type NormalizedUser = {
  id: number | string;
  name: string;
  email: string;
  avatarUrl?: string;
};

function extractUser(payload: unknown): ApiUser | null {
  //1.- Support both plain user payloads and Laravel resources that wrap the user in a `data` object.
  if (!payload || typeof payload !== "object") {
    return null;
  }
  if ("data" in payload && payload.data) {
    return extractUser((payload as { data: unknown }).data);
  }
  return payload as ApiUser;
}

function normalizeUser(payload: unknown): NormalizedUser | null {
  //1.- Parse the Laravel user resource and surface consistent fields for the UI.
  const raw = extractUser(payload);
  if (!raw) {
    return null;
  }
  const nameCandidate = raw.name ?? raw.profile?.name ?? undefined;
  const emailCandidate = raw.email ?? undefined;
  if (!nameCandidate && !emailCandidate) {
    return null;
  }
  return {
    id: raw.id ?? "user",
    name: nameCandidate ? String(nameCandidate) : emailCandidate ? String(emailCandidate) : "User",
    email: emailCandidate ? String(emailCandidate) : "",
    avatarUrl: raw.avatar_url ?? raw.profile_photo_url ?? undefined,
  };
}

function buildInitials(name: string, email: string): string {
  //1.- Prefer initials derived from the operator name and fall back to the email local-part.
  const trimmedName = name.trim();
  if (trimmedName) {
    const parts = trimmedName.split(/\s+/).filter(Boolean).slice(0, 2);
    if (parts.length > 0) {
      return parts.map((part) => part[0]?.toUpperCase() ?? "").join("") || "--";
    }
  }
  const emailLocalPart = email.split("@")[0] ?? "";
  const fallback = emailLocalPart.slice(0, 2).toUpperCase();
  return fallback || "--";
}

function resolveLoginRedirect(): string {
  //1.- Reconstruct the localized login path using the first URL segment when available.
  if (typeof window === "undefined") {
    return "/auth/login";
  }
  const supportedLocales = ["en", "es", "pt", "zh", "ja"];
  const segments = window.location.pathname.split("/").filter(Boolean);
  const localeCandidate = segments[0];
  if (localeCandidate && supportedLocales.includes(localeCandidate)) {
    return `/${localeCandidate}/auth/login`;
  }
  return "/auth/login";
}

export function UserNav() {
  const [user, setUser] = useState<NormalizedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        //1.- Request the authenticated user resource through the shared API client.
        const payload = await apiRequest<unknown>("user");
        if (!mounted) {
          return;
        }
        setUser(normalizeUser(payload));
      } catch {
        if (!mounted) {
          return;
        }
        setUser(null);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const initials = useMemo(() => buildInitials(user?.name ?? "", user?.email ?? ""), [user]);
  const displayName = user?.name ?? (isLoading ? "Loading…" : "User");
  const displayEmail = user?.email ?? (isLoading ? "Loading…" : "");

  const handleSignOut = useCallback(async () => {
    if (isSigningOut) {
      return;
    }
    setIsSigningOut(true);
    try {
      //1.- Forward the logout request to the Next.js API route so Laravel revokes the Sanctum cookies.
      const response = await fetch("/private/api/auth/signout", {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Logout failed");
      }
    } catch {
      //2.- Swallow network errors—the fallback below still clears credentials locally.
    } finally {
      //3.- Clear stored bearer tokens and redirect to the localized login screen.
      clearStoredToken();
      setUser(null);
      setIsSigningOut(false);
      if (typeof window !== "undefined") {
        const redirectTarget = resolveLoginRedirect();
        if (typeof window.location.assign === "function") {
          window.location.assign(redirectTarget);
        } else {
          window.location.href = redirectTarget;
        }
      }
    }
  }, [isSigningOut]);

  return (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="relative h-8 w-8 rounded-full"
                aria-label="Open user menu"
              >
                <Avatar className="h-8 w-8">
                  {user?.avatarUrl ? (
                    <AvatarImage src={user.avatarUrl} alt={displayName} />
                  ) : (
                    <AvatarFallback className="bg-transparent">{initials}</AvatarFallback>
                  )}
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">Profile</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            {displayEmail && (
              <p className="text-xs leading-none text-muted-foreground">{displayEmail}</p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="hover:cursor-pointer" asChild>
            <Link href="/dashboard" className="flex items-center">
              <LayoutGrid className="w-4 h-4 mr-3 text-muted-foreground" />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:cursor-pointer" asChild>
            <Link href="/account" className="flex items-center">
              <User className="w-4 h-4 mr-3 text-muted-foreground" />
              Account
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="hover:cursor-pointer"
          disabled={isSigningOut}
          onSelect={(event) => {
            //1.- Prevent the dropdown from closing early when the menu item is disabled.
            if (isSigningOut) {
              event.preventDefault();
              return;
            }
            handleSignOut();
          }}
          onClick={(event) => {
            //2.- Support environments (e.g., tests) that trigger click without Radix's select event.
            if (isSigningOut) {
              event.preventDefault();
              return;
            }
            handleSignOut();
          }}
        >
          <LogOut className="w-4 h-4 mr-3 text-muted-foreground" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
