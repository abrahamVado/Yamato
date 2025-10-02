import { NextRequest, NextResponse } from "next/server";
import { buildUser, ensureSanctum } from "@/app/api/_lib/auth";

export async function GET(request: NextRequest): Promise<NextResponse> {
  //1.- Ensure the caller is authenticated before returning the profile payload.
  const guard = ensureSanctum(request);
  if (guard) {
    return guard;
  }

  //2.- Provide the current user and tag the response with the profile section meta.
  return NextResponse.json(
    {
      user: buildUser(),
      meta: {
        section: "profile",
      },
    },
    { status: 200 },
  );
}
