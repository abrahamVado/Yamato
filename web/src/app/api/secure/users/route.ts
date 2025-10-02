import { NextRequest, NextResponse } from "next/server";
import { buildUser, ensureSanctum } from "@/app/api/_lib/auth";

export async function GET(request: NextRequest): Promise<NextResponse> {
  //1.- Validate Sanctum credentials before exposing the secure users payload.
  const guard = ensureSanctum(request);
  if (guard) {
    return guard;
  }

  //2.- Return the authenticated user alongside the users meta section marker.
  return NextResponse.json(
    {
      user: buildUser(),
      meta: {
        section: "users",
      },
    },
    { status: 200 },
  );
}
