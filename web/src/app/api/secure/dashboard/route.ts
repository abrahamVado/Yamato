import { NextRequest, NextResponse } from "next/server";
import { buildUser, ensureSanctum } from "@/app/api/_lib/auth";

type SecureDashboardResponse = {
  user: ReturnType<typeof buildUser>;
  meta: {
    section: string;
    message: string;
  };
};

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
  //1.- Guard the route using the shared Sanctum helper and bail out on failure.
  const guard = ensureSanctum(request);
  if (guard) {
    return guard;
  }

  //2.- When the token is valid, return the authenticated user with secure meta data.
  return NextResponse.json(buildResponseBody(), { status: 200 });
}
