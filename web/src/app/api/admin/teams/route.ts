import { NextRequest, NextResponse } from "next/server";
import { ensureSanctum } from "@/app/api/_lib/auth";
import {
  createTeam,
  findUser,
  syncTeamMembers,
  teamNameExists,
} from "@/app/api/admin/_data/store";
import {
  parseBody,
  serializeTeamCollection,
  serializeTeamEntity,
  validationError,
} from "@/app/api/admin/_lib/validation";
import { teamCreateSchema } from "@/app/api/admin/_lib/validation";

function buildValidationResponse(errors: Record<string, string[]>) {
  //1.- Output validation feedback mirroring Laravel's response contract.
  return NextResponse.json(validationError(errors), { status: 422 });
}

function sanitizeMembers(members: { id: number; role: string }[] | undefined) {
  //1.- Convert incoming member payloads into the internal TeamMember structure.
  if (!members) {
    return [] as { userId: number; role: string }[];
  }
  return members.map((member) => ({ userId: member.id, role: member.role }));
}

function validateMembers(members: { id: number; role: string }[] | undefined) {
  //1.- Ensure referenced users exist before attaching them to a team.
  const errors: Record<string, string[]> = {};
  if (!members) {
    return errors;
  }
  const missing = members.filter((member) => !findUser(member.id));
  if (missing.length > 0) {
    errors.members = ["One or more users could not be found."];
  }
  return errors;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  //1.- Require Sanctum authentication before exposing the team catalogue.
  const guard = ensureSanctum(request);
  if (guard) {
    return guard;
  }

  return NextResponse.json({ data: serializeTeamCollection() }, { status: 200 });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  //1.- Guard the creation endpoint using the shared helper.
  const guard = ensureSanctum(request);
  if (guard) {
    return guard;
  }

  const json = await request.json().catch(() => ({}));
  const parsed = parseBody(teamCreateSchema, json);
  if ("error" in parsed) {
    return buildValidationResponse(parsed.error);
  }

  const { name, description, members } = parsed.data;

  const errors: Record<string, string[]> = {};
  if (teamNameExists(name)) {
    errors.name = ["The team name has already been taken."];
  }
  Object.assign(errors, validateMembers(members));

  if (Object.keys(errors).length > 0) {
    return buildValidationResponse(errors);
  }

  const team = createTeam({ name, description, members: [] });
  const sanitizedMembers = sanitizeMembers(members);
  syncTeamMembers(team.id, sanitizedMembers);

  return NextResponse.json({ data: serializeTeamEntity(team) }, { status: 201 });
}
