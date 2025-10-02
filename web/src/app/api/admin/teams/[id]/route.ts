import { NextRequest, NextResponse } from "next/server";
import { ensureSanctum } from "@/app/api/_lib/auth";
import {
  deleteTeam,
  findTeam,
  findUser,
  syncTeamMembers,
  teamNameExists,
  updateTeam,
} from "@/app/api/admin/_data/store";
import {
  parseBody,
  serializeTeamEntity,
  validationError,
} from "@/app/api/admin/_lib/validation";
import { teamUpdateSchema } from "@/app/api/admin/_lib/validation";

function parseTeamId(params: { id: string }): number | null {
  //1.- Parse the dynamic segment into an integer identifier.
  const value = Number(params.id);
  return Number.isInteger(value) && value > 0 ? value : null;
}

function notFound() {
  //1.- Return a Laravel-style JSON 404 response.
  return NextResponse.json({ message: "Resource not found." }, { status: 404 });
}

function buildValidationResponse(errors: Record<string, string[]>) {
  //1.- Format validation errors for API consumers.
  return NextResponse.json(validationError(errors), { status: 422 });
}

async function guard(request: NextRequest) {
  //1.- Ensure Sanctum credentials are present.
  const response = ensureSanctum(request);
  if (response) {
    throw response;
  }
}

function sanitizeMembers(members: { id: number; role: string }[] | undefined) {
  //1.- Convert the public members payload into TeamMember entries.
  if (!members) {
    return [] as { userId: number; role: string }[];
  }
  return members.map((member) => ({ userId: member.id, role: member.role }));
}

function validateMembers(members: { id: number; role: string }[] | undefined) {
  //1.- Validate that member user ids exist.
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

export async function GET(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  try {
    await guard(request);
  } catch (response) {
    return response as NextResponse;
  }

  const id = parseTeamId(params);
  if (!id) {
    return notFound();
  }

  const team = findTeam(id);
  if (!team) {
    return notFound();
  }

  return NextResponse.json({ data: serializeTeamEntity(team) }, { status: 200 });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  return updateTeamHandler(request, params);
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  return updateTeamHandler(request, params);
}

async function updateTeamHandler(request: NextRequest, params: { id: string }): Promise<NextResponse> {
  try {
    await guard(request);
  } catch (response) {
    return response as NextResponse;
  }

  const id = parseTeamId(params);
  if (!id) {
    return notFound();
  }

  const team = findTeam(id);
  if (!team) {
    return notFound();
  }

  const json = await request.json().catch(() => ({}));
  const parsed = parseBody(teamUpdateSchema, json);
  if ("error" in parsed) {
    return buildValidationResponse(parsed.error);
  }

  const { name, description, members } = parsed.data;

  const errors: Record<string, string[]> = {};
  if (name !== undefined && teamNameExists(name, team.id)) {
    errors.name = ["The team name has already been taken."];
  }
  Object.assign(errors, validateMembers(members));

  if (Object.keys(errors).length > 0) {
    return buildValidationResponse(errors);
  }

  const updates: Parameters<typeof updateTeam>[1] = {};
  if (name !== undefined) {
    updates.name = name;
  }
  if (description !== undefined) {
    updates.description = description;
  }
  if (Object.keys(updates).length > 0) {
    updateTeam(team.id, updates);
  }

  if (members !== undefined) {
    const sanitizedMembers = sanitizeMembers(members);
    syncTeamMembers(team.id, sanitizedMembers);
  }

  return NextResponse.json({ data: serializeTeamEntity(findTeam(team.id)!) }, { status: 200 });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  try {
    await guard(request);
  } catch (response) {
    return response as NextResponse;
  }

  const id = parseTeamId(params);
  if (!id) {
    return notFound();
  }

  const team = findTeam(id);
  if (!team) {
    return notFound();
  }

  deleteTeam(id);
  return new NextResponse(null, { status: 204 });
}
