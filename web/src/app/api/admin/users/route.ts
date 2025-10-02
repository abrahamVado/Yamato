import { NextRequest, NextResponse } from "next/server";
import { ensureSanctum } from "@/app/api/_lib/auth";
import { createProfile, createUser, emailExists, listUsers, updateProfile } from "@/app/api/admin/_data/store";
import {
  handleUserProfile,
  handleUserRelationships,
  parseBody,
  serializeUser,
  userCreateSchema,
} from "@/app/api/admin/_lib/validation";
import { buildValidationResponse, validateAssociations } from "@/app/api/admin/users/helpers";

export async function GET(request: NextRequest): Promise<NextResponse> {
  //1.- Ensure the caller is authenticated under the Sanctum guard.
  const guard = ensureSanctum(request);
  if (guard) {
    return guard;
  }

  //2.- Serialize all users with eager-loaded relationships for the admin list.
  const users = listUsers().map(serializeUser);
  return NextResponse.json({ data: users }, { status: 200 });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  //1.- Enforce Sanctum authentication before mutating user data.
  const guard = ensureSanctum(request);
  if (guard) {
    return guard;
  }

  //2.- Parse the incoming JSON body using the shared schema.
  const json = await request.json().catch(() => ({}));
  const parsed = parseBody(userCreateSchema, json);
  if ("error" in parsed) {
    return buildValidationResponse(parsed.error);
  }

  const { name, email, password, roles, teams, profile } = parsed.data;

  //3.- Perform additional integrity checks that rely on the in-memory store state.
  const errors: Record<string, string[]> = {};
  if (emailExists(email)) {
    errors.email = ["The email has already been taken."];
  }

  Object.assign(errors, validateAssociations(roles, teams));

  if (Object.keys(errors).length > 0) {
    return buildValidationResponse(errors);
  }

  //4.- Create the base user record before applying relationships.
  const user = createUser({
    name,
    email,
    password,
    roleIds: roles ?? [],
    teamMemberships: [],
    profileId: null,
  });

  //5.- Sync roles, teams, and profile payloads as requested.
  handleUserRelationships(user, roles ?? [], teams ?? []);
  handleUserProfile(user, profile, createProfile, updateProfile);

  //6.- Return the serialized user with relations eagerly loaded.
  return NextResponse.json({ data: serializeUser(user) }, { status: 201 });
}
