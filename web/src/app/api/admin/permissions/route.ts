import { NextRequest, NextResponse } from "next/server";
import { ensureSanctum } from "@/app/api/_lib/auth";
import { createPermission, permissionNameExists } from "@/app/api/admin/_data/store";
import {
  parseBody,
  serializePermissionCollection,
  validationError,
} from "@/app/api/admin/_lib/validation";
import { permissionCreateSchema } from "@/app/api/admin/_lib/validation";

function buildValidationResponse(errors: Record<string, string[]>) {
  //1.- Return validation errors using the standard JSON envelope.
  return NextResponse.json(validationError(errors), { status: 422 });
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  //1.- Check Sanctum credentials before returning the permission catalogue.
  const guard = ensureSanctum(request);
  if (guard) {
    return guard;
  }

  return NextResponse.json({ data: serializePermissionCollection() }, { status: 200 });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  //1.- Protect creation with Sanctum.
  const guard = ensureSanctum(request);
  if (guard) {
    return guard;
  }

  const json = await request.json().catch(() => ({}));
  const parsed = parseBody(permissionCreateSchema, json);
  if ("error" in parsed) {
    return buildValidationResponse(parsed.error);
  }

  const { name, display_name, description } = parsed.data;

  const errors: Record<string, string[]> = {};
  if (permissionNameExists(name)) {
    errors.name = ["The permission name has already been taken."];
  }

  if (Object.keys(errors).length > 0) {
    return buildValidationResponse(errors);
  }

  const permission = createPermission({ name, display_name, description });
  return NextResponse.json({ data: permission }, { status: 201 });
}
