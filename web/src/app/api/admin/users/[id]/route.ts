import { NextRequest, NextResponse } from "next/server";
import { ensureSanctum } from "@/app/api/_lib/auth";
import {
  createProfile,
  deleteUser,
  emailExists,
  findUser,
  updateProfile,
  updateUser,
} from "@/app/api/admin/_data/store";
import {
  handleUserProfile,
  handleUserRelationships,
  parseBody,
  serializeUser,
  userUpdateSchema,
} from "@/app/api/admin/_lib/validation";
import { buildValidationResponse, validateAssociations } from "@/app/api/admin/users/helpers";

function parseUserId(params: { id: string }): number | null {
  //1.- Convert the dynamic segment into a positive integer identifier.
  const value = Number(params.id);
  return Number.isInteger(value) && value > 0 ? value : null;
}

function notFound() {
  //1.- Mirror Laravel's default JSON payload for missing resources.
  return NextResponse.json({ message: "Resource not found." }, { status: 404 });
}

async function ensureAuthenticated(request: NextRequest) {
  //1.- Reuse the Sanctum helper to reject unauthenticated requests early.
  const guard = ensureSanctum(request);
  if (guard) {
    throw guard;
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  try {
    await ensureAuthenticated(request);
  } catch (response) {
    return response as NextResponse;
  }

  //1.- Validate the identifier before looking up the user.
  const id = parseUserId(params);
  if (!id) {
    return notFound();
  }

  const user = findUser(id);
  if (!user) {
    return notFound();
  }

  //2.- Return the hydrated user resource.
  return NextResponse.json({ data: serializeUser(user) }, { status: 200 });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  return updateUserHandler(request, params);
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  return updateUserHandler(request, params);
}

async function updateUserHandler(request: NextRequest, params: { id: string }): Promise<NextResponse> {
  try {
    await ensureAuthenticated(request);
  } catch (response) {
    return response as NextResponse;
  }

  const id = parseUserId(params);
  if (!id) {
    return notFound();
  }

  const user = findUser(id);
  if (!user) {
    return notFound();
  }

  const json = await request.json().catch(() => ({}));
  const parsed = parseBody(userUpdateSchema, json);
  if ("error" in parsed) {
    return buildValidationResponse(parsed.error);
  }

  const { name, email, password, roles, teams, profile } = parsed.data;

  const errors: Record<string, string[]> = {};
  if (email !== undefined && emailExists(email, user.id)) {
    errors.email = ["The email has already been taken."];
  }

  Object.assign(errors, validateAssociations(roles, teams));

  if (Object.keys(errors).length > 0) {
    return buildValidationResponse(errors);
  }

  const updates: Partial<Parameters<typeof updateUser>[1]> = {};
  if (name !== undefined) {
    updates.name = name;
  }
  if (email !== undefined) {
    updates.email = email;
  }
  if (password !== undefined) {
    updates.password = password;
  }
  if (Object.keys(updates).length > 0) {
    updateUser(user.id, updates);
  }

  handleUserRelationships(user, roles, teams);
  handleUserProfile(user, profile, createProfile, updateProfile);

  return NextResponse.json({ data: serializeUser(user) }, { status: 200 });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  try {
    await ensureAuthenticated(request);
  } catch (response) {
    return response as NextResponse;
  }

  const id = parseUserId(params);
  if (!id) {
    return notFound();
  }

  const user = findUser(id);
  if (!user) {
    return notFound();
  }

  deleteUser(id);
  return new NextResponse(null, { status: 204 });
}
