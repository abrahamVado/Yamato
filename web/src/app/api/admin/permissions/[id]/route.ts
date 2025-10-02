import { NextRequest, NextResponse } from "next/server";
import { ensureSanctum } from "@/app/api/_lib/auth";
import { deletePermission, findPermission, permissionNameExists, updatePermission } from "@/app/api/admin/_data/store";
import { parseBody, validationError } from "@/app/api/admin/_lib/validation";
import { permissionUpdateSchema } from "@/app/api/admin/_lib/validation";

function parsePermissionId(params: { id: string }): number | null {
  //1.- Convert the param into a valid identifier.
  const value = Number(params.id);
  return Number.isInteger(value) && value > 0 ? value : null;
}

function notFound() {
  //1.- Provide a consistent 404 payload for missing permissions.
  return NextResponse.json({ message: "Resource not found." }, { status: 404 });
}

function buildValidationResponse(errors: Record<string, string[]>) {
  //1.- Wrap validation errors inside Laravel's structure.
  return NextResponse.json(validationError(errors), { status: 422 });
}

async function guard(request: NextRequest) {
  //1.- Apply the Sanctum guard and surface the response when invalid.
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

  const id = parsePermissionId(params);
  if (!id) {
    return notFound();
  }

  const permission = findPermission(id);
  if (!permission) {
    return notFound();
  }

  return NextResponse.json({ data: permission }, { status: 200 });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  return updatePermissionHandler(request, params);
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  return updatePermissionHandler(request, params);
}

async function updatePermissionHandler(request: NextRequest, params: { id: string }): Promise<NextResponse> {
  try {
    await guard(request);
  } catch (response) {
    return response as NextResponse;
  }

  const id = parsePermissionId(params);
  if (!id) {
    return notFound();
  }

  const permission = findPermission(id);
  if (!permission) {
    return notFound();
  }

  const json = await request.json().catch(() => ({}));
  const parsed = parseBody(permissionUpdateSchema, json);
  if ("error" in parsed) {
    return buildValidationResponse(parsed.error);
  }

  const { name, display_name, description } = parsed.data;

  const errors: Record<string, string[]> = {};
  if (name !== undefined && permissionNameExists(name, permission.id)) {
    errors.name = ["The permission name has already been taken."];
  }

  if (Object.keys(errors).length > 0) {
    return buildValidationResponse(errors);
  }

  const updates: Parameters<typeof updatePermission>[1] = {};
  if (name !== undefined) {
    updates.name = name;
  }
  if (display_name !== undefined) {
    updates.display_name = display_name;
  }
  if (description !== undefined) {
    updates.description = description;
  }

  const updated = updatePermission(permission.id, updates)!;
  return NextResponse.json({ data: updated }, { status: 200 });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  try {
    await guard(request);
  } catch (response) {
    return response as NextResponse;
  }

  const id = parsePermissionId(params);
  if (!id) {
    return notFound();
  }

  const permission = findPermission(id);
  if (!permission) {
    return notFound();
  }

  deletePermission(id);
  return new NextResponse(null, { status: 204 });
}
