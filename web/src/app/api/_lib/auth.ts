import { NextRequest, NextResponse } from "next/server";

export const AUTH_TOKEN = "demo-sanctum-token";

export type AuthenticatedUser = {
  id: number;
  name: string;
  email: string;
};

export function buildUser(): AuthenticatedUser {
  //1.- Provide a deterministic authenticated user for mocked Sanctum flows.
  return {
    id: 1,
    name: "Demo User",
    email: "demo.user@example.com",
  };
}

export function extractToken(request: NextRequest): string | null {
  //1.- Attempt to read the Bearer token from the Authorization header first.
  const header = request.headers.get("authorization");
  if (header?.startsWith("Bearer ")) {
    const value = header.slice("Bearer ".length).trim();
    if (value.length > 0) {
      return value;
    }
  }

  //2.- Fall back to the auth_token cookie that Playwright tests use for convenience.
  const cookie = request.cookies.get("auth_token");
  if (cookie?.value) {
    return cookie.value;
  }

  //3.- When neither source provides a credential we treat the request as unauthenticated.
  return null;
}

export function ensureSanctum(request: NextRequest): NextResponse | null {
  //1.- Extract the provided credential from the incoming request.
  const token = extractToken(request);
  //2.- Compare the token against the demo Sanctum token and return a 401 when invalid.
  if (token !== AUTH_TOKEN) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  }
  //3.- Returning null signals that the request is allowed to proceed.
  return null;
}
