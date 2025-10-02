import { NextResponse } from "next/server";
import { findRole, findTeam } from "@/app/api/admin/_data/store";
import { validationError } from "@/app/api/admin/_lib/validation";

export function buildValidationResponse(errors: Record<string, string[]>) {
  //1.- Wrap validation errors in a Sanctum-style JSON response.
  return NextResponse.json(validationError(errors), { status: 422 });
}

export function validateAssociations(roles: number[] | undefined, teams: { id: number; role: string }[] | undefined) {
  //1.- Collect association errors for invalid role or team identifiers.
  const errors: Record<string, string[]> = {};

  if (roles) {
    const missing = roles.filter((id) => !findRole(id));
    if (missing.length > 0) {
      errors.roles = ["One or more roles do not exist."];
    }
  }

  if (teams) {
    const missingTeam = teams.filter((item) => !findTeam(item.id));
    if (missingTeam.length > 0) {
      errors["teams"] = ["One or more teams do not exist."];
    }
  }

  return errors;
}
