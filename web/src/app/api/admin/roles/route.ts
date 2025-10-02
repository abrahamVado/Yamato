import { NextRequest, NextResponse } from "next/server";
import { ensureSanctum } from "@/app/api/_lib/auth";
import { createRole, roleNameExists } from "@/app/api/admin/_data/store";
import {
  parseBody,
  serializeRoleCollection,
  serializeRoleWithPermissions,
} from "@/app/api/admin/_lib/validation";
import { roleCreateSchema } from "@/app/api/admin/_lib/validation";
import { buildValidationResponse, validatePermissions } from "@/app/api/admin/roles/helpers";

export async function GET(request: NextRequest): Promise<NextResponse> {
  //1.- Guard the request with the Sanctum helper before exposing data.
  const guard = ensureSanctum(request);
  if (guard) {
    return guard;
  }

  //2.- Return roles with their permissions eager-loaded.
  return NextResponse.json({ data: serializeRoleCollection() }, { status: 200 });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  //1.- Protect the mutation endpoint with Sanctum.
  const guard = ensureSanctum(request);
  if (guard) {
    return guard;
  }

  const json = await request.json().catch(() => ({}));
  const parsed = parseBody(roleCreateSchema, json);
  if ("error" in parsed) {
    return buildValidationResponse(parsed.error);
  }

  const { name, display_name, description, permissions } = parsed.data;

  const errors: Record<string, string[]> = {};
  if (roleNameExists(name)) {
    errors.name = ["The role name has already been taken."];
  }
  Object.assign(errors, validatePermissions(permissions));

  if (Object.keys(errors).length > 0) {
    return buildValidationResponse(errors);
  }

  const role = createRole({
    name,
    display_name,
    description,
    permissionIds: permissions ?? [],
  });

  return NextResponse.json({ data: serializeRoleWithPermissions(role) }, { status: 201 });
}
