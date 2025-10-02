import { NextRequest, NextResponse } from "next/server";

const AUTH_TOKEN = "demo-sanctum-token";

type AuthenticatedUser = {
  id: number;
  name: string;
  email: string;
};

type SecureDashboardResponse = {
  user: AuthenticatedUser;
  meta: {
    section: string;
    message: string;
  };
};

function extractToken(request: NextRequest): string | null {
  //1.- Check the Authorization header for a Bearer token first.
  const authorizationHeader = request.headers.get("authorization");
  if (authorizationHeader?.startsWith("Bearer ")) {
    const headerToken = authorizationHeader.slice("Bearer ".length).trim();
    if (headerToken.length > 0) {
      return headerToken;
    }
  }

  //2.- If the header is missing, fall back to the auth_token cookie used during tests.
  const authCookie = request.cookies.get("auth_token");
  if (authCookie?.value) {
    return authCookie.value;
  }

  //3.- When neither credential exists we treat the request as unauthenticated.
  return null;
}

function buildUser(): AuthenticatedUser {
  //1.- Provide a deterministic mock user for local development and tests.
  return {
    id: 1,
    name: "Demo User",
    email: "demo.user@example.com",
  };
}

function buildResponseBody(): SecureDashboardResponse {
  //1.- Compose the response structure expected by the secure dashboard client.
  return {
    user: buildUser(),
    meta: {
      section: "dashboard",
      message: "Authenticated access granted.",
    },
  };
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  //1.- Guard the route by extracting and validating the provided token.
  const token = extractToken(request);
  if (token !== AUTH_TOKEN) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  }

  //2.- When the token is valid, return the authenticated user with secure meta data.
  return NextResponse.json(buildResponseBody(), { status: 200 });
}
