import { NextRequest, NextResponse } from "next/server";
import { buildUser, ensureSanctum } from "@/app/api/_lib/auth";

export async function GET(request: NextRequest): Promise<NextResponse> {
  //1.- Require authentication before revealing the errors section metadata.
  const guard = ensureSanctum(request);
  if (guard) {
    return guard;
  }

  //2.- Deliver the user payload with the errors section identifier.
  return NextResponse.json(
    {
      user: buildUser(),
      meta: {
        section: "errors",
      },
    },
    { status: 200 },
  );
}
