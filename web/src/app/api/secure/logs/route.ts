import { NextRequest, NextResponse } from "next/server";
import { buildUser, ensureSanctum } from "@/app/api/_lib/auth";

export async function GET(request: NextRequest): Promise<NextResponse> {
  //1.- Protect the logs section using the shared Sanctum guard.
  const guard = ensureSanctum(request);
  if (guard) {
    return guard;
  }

  //2.- Send back the authenticated user with the logs section descriptor.
  return NextResponse.json(
    {
      user: buildUser(),
      meta: {
        section: "logs",
      },
    },
    { status: 200 },
  );
}
