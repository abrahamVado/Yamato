import { NextRequest, NextResponse } from "next/server";
import { ensureSanctum } from "@/app/api/_lib/auth";
import { attachProfileToUser, createProfile, findUser, profileUserExists } from "@/app/api/admin/_data/store";
import {
  parseBody,
  serializeProfileCollection,
  serializeProfileEntity,
  validationError,
} from "@/app/api/admin/_lib/validation";
import { profileCreateSchema } from "@/app/api/admin/_lib/validation";

function buildValidationResponse(errors: Record<string, string[]>) {
  //1.- Return validation errors using the Laravel-compatible envelope.
  return NextResponse.json(validationError(errors), { status: 422 });
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  //1.- Ensure the listing is only available to authenticated callers.
  const guard = ensureSanctum(request);
  if (guard) {
    return guard;
  }

  return NextResponse.json({ data: serializeProfileCollection() }, { status: 200 });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  //1.- Enforce Sanctum authentication.
  const guard = ensureSanctum(request);
  if (guard) {
    return guard;
  }

  const json = await request.json().catch(() => ({}));
  const parsed = parseBody(profileCreateSchema, json);
  if ("error" in parsed) {
    return buildValidationResponse(parsed.error);
  }

  const { user_id, name, phone, meta } = parsed.data;

  const errors: Record<string, string[]> = {};
  const user = findUser(user_id);
  if (!user) {
    errors.user_id = ["The selected user does not exist."];
  } else if (profileUserExists(user_id)) {
    errors.user_id = ["The user already has a profile."];
  }

  if (Object.keys(errors).length > 0) {
    return buildValidationResponse(errors);
  }

  const profile = createProfile({ userId: user_id, name, phone, meta });
  attachProfileToUser(user_id, profile.id);

  return NextResponse.json({ data: serializeProfileEntity(profile) }, { status: 201 });
}
