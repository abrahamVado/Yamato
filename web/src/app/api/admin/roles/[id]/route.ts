import { NextRequest, NextResponse } from "next/server";
import { ensureSanctum } from "@/app/api/_lib/auth";
import { deleteRole, findRole, roleNameExists, updateRole } from "@/app/api/admin/_data/store";
import {
  parseBody,
  serializeRoleWithPermissions,
} from "@/app/api/admin/_lib/validation";
import { roleUpdateSchema } from "@/app/api/admin/_lib/validation";
import { buildValidationResponse, validatePermissions } from "@/app/api/admin/roles/helpers";

function parseRoleId(params: { id: string }): number | null {
  //1.- Convert the path segment into a usable numeric identifier.
  const value = Number(params.id);
  return Number.isInteger(value) && value > 0 ? value : null;
}

function notFound() {
  //1.- Provide a consistent 404 response payload.
  return NextResponse.json({ message: "Resource not found." }, { status: 404 });
}

async function guard(request: NextRequest) {
  //1.- Reuse the Sanctum helper to short-circuit unauthenticated requests.
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

  const id = parseRoleId(params);
  if (!id) {
    return notFound();
  }

  const role = findRole(id);
  if (!role) {
    return notFound();
  }

  return NextResponse.json({ data: serializeRoleWithPermissions(role) }, { status: 200 });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  return updateRoleHandler(request, params);
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  return updateRoleHandler(request, params);
}

async function updateRoleHandler(request: NextRequest, params: { id: string }): Promise<NextResponse> {
  try {
    await guard(request);
  } catch (response) {
    return response as NextResponse;
  }

  const id = parseRoleId(params);
  if (!id) {
    return notFound();
  }

  const role = findRole(id);
  if (!role) {
    return notFound();
  }

  const json = await request.json().catch(() => ({}));
  const parsed = parseBody(roleUpdateSchema, json);
  if ("error" in parsed) {
    return buildValidationResponse(parsed.error);
  }

  const { name, display_name, description, permissions } = parsed.data;

  const errors: Record<string, string[]> = {};
  if (name !== undefined && roleNameExists(name, role.id)) {
    errors.name = ["The role name has already been taken."];
  }
  Object.assign(errors, validatePermissions(permissions));

  if (Object.keys(errors).length > 0) {
    return buildValidationResponse(errors);
  }

  const updates: Parameters<typeof updateRole>[1] = {};
  if (name !== undefined) {
    updates.name = name;
  }
  if (display_name !== undefined) {
    updates.display_name = display_name;
  }
  if (description !== undefined) {
    updates.description = description;
  }
  if (permissions !== undefined) {
    updates.permissionIds = permissions;
  }

  updateRole(role.id, updates);

  return NextResponse.json({ data: serializeRoleWithPermissions(findRole(role.id)!) }, { status: 200 });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  try {
    await guard(request);
  } catch (response) {
    return response as NextResponse;
  }

  const id = parseRoleId(params);
  if (!id) {
    return notFound();
  }

  const role = findRole(id);
  if (!role) {
    return notFound();
  }

  deleteRole(id);
  return new NextResponse(null, { status: 204 });
}
