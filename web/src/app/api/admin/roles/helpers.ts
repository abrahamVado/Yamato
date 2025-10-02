import { NextResponse } from "next/server";
import { findPermission } from "@/app/api/admin/_data/store";
import { validationError } from "@/app/api/admin/_lib/validation";

export function buildValidationResponse(errors: Record<string, string[]>) {
  //1.- Format validation errors consistently with Laravel responses.
  return NextResponse.json(validationError(errors), { status: 422 });
}

export function validatePermissions(permissions: number[] | undefined) {
  //1.- Ensure all supplied permission identifiers exist.
  if (!permissions) {
    return {};
  }
  const missing = permissions.filter((id) => !findPermission(id));
  return missing.length > 0 ? { permissions: ["One or more permissions do not exist."] } : {};
}
