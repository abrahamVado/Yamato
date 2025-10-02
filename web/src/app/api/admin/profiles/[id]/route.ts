import { NextRequest, NextResponse } from "next/server";
import { ensureSanctum } from "@/app/api/_lib/auth";
import {
  attachProfileToUser,
  deleteProfile,
  findProfile,
  findUser,
  profileUserExists,
  updateProfile,
} from "@/app/api/admin/_data/store";
import {
  parseBody,
  serializeProfileEntity,
  validationError,
} from "@/app/api/admin/_lib/validation";
import { profileUpdateSchema } from "@/app/api/admin/_lib/validation";

function parseProfileId(params: { id: string }): number | null {
  //1.- Convert the param into an integer identifier when possible.
  const value = Number(params.id);
  return Number.isInteger(value) && value > 0 ? value : null;
}

function notFound() {
  //1.- Provide a JSON 404 response compatible with Laravel conventions.
  return NextResponse.json({ message: "Resource not found." }, { status: 404 });
}

function buildValidationResponse(errors: Record<string, string[]>) {
  //1.- Shape validation errors to mirror Laravel's JSON format.
  return NextResponse.json(validationError(errors), { status: 422 });
}

async function guard(request: NextRequest) {
  //1.- Invoke the Sanctum guard helper for consistency.
  const response = ensureSanctum(request);
  if (response) {
    throw response;
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  try {
    await guard(request);
  } catch (response) {
    return response as NextResponse;
  }

  const id = parseProfileId(params);
  if (!id) {
    return notFound();
  }

  const profile = findProfile(id);
  if (!profile) {
    return notFound();
  }

  return NextResponse.json({ data: serializeProfileEntity(profile) }, { status: 200 });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  return updateProfileHandler(request, params);
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  return updateProfileHandler(request, params);
}

async function updateProfileHandler(request: NextRequest, params: { id: string }): Promise<NextResponse> {
  try {
    await guard(request);
  } catch (response) {
    return response as NextResponse;
  }

  const id = parseProfileId(params);
  if (!id) {
    return notFound();
  }

  const profile = findProfile(id);
  if (!profile) {
    return notFound();
  }

  const json = await request.json().catch(() => ({}));
  const parsed = parseBody(profileUpdateSchema, json);
  if ("error" in parsed) {
    return buildValidationResponse(parsed.error);
  }

  const { user_id, name, phone, meta } = parsed.data;

  const errors: Record<string, string[]> = {};
  if (user_id !== undefined) {
    const targetUser = findUser(user_id);
    if (!targetUser) {
      errors.user_id = ["The selected user does not exist."];
    } else if (profileUserExists(user_id, profile.id)) {
      errors.user_id = ["The user already has a profile."];
    }
  }

  if (Object.keys(errors).length > 0) {
    return buildValidationResponse(errors);
  }

  const updates: Parameters<typeof updateProfile>[1] = {};
  if (user_id !== undefined) {
    attachProfileToUser(profile.userId, null);
    updates.userId = user_id;
  }
  if (name !== undefined) {
    updates.name = name;
  }
  if (phone !== undefined) {
    updates.phone = phone;
  }
  if (meta !== undefined) {
    updates.meta = meta;
  }

  const updated = updateProfile(profile.id, updates)!;
  if (user_id !== undefined) {
    attachProfileToUser(user_id, updated.id);
  }

  return NextResponse.json({ data: serializeProfileEntity(updated) }, { status: 200 });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  try {
    await guard(request);
  } catch (response) {
    return response as NextResponse;
  }

  const id = parseProfileId(params);
  if (!id) {
    return notFound();
  }

  const profile = findProfile(id);
  if (!profile) {
    return notFound();
  }

  deleteProfile(id);
  return new NextResponse(null, { status: 204 });
}
