import { NextRequest, NextResponse } from "next/server";
import { ensureSanctum } from "@/app/api/_lib/auth";
import { deleteSetting, findSetting, settingKeyExists, updateSetting } from "@/app/api/admin/_data/store";
import {
  parseBody,
  serializeSettingEntity,
  validationError,
} from "@/app/api/admin/_lib/validation";
import { settingUpdateSchema } from "@/app/api/admin/_lib/validation";

function parseSettingId(params: { id: string }): number | null {
  //1.- Convert the path segment into a valid numeric identifier.
  const value = Number(params.id);
  return Number.isInteger(value) && value > 0 ? value : null;
}

function notFound() {
  //1.- Return a JSON 404 payload consistent with Laravel.
  return NextResponse.json({ message: "Resource not found." }, { status: 404 });
}

function buildValidationResponse(errors: Record<string, string[]>) {
  //1.- Present validation errors using Laravel's JSON structure.
  return NextResponse.json(validationError(errors), { status: 422 });
}

async function guard(request: NextRequest) {
  //1.- Enforce Sanctum authentication for all handlers.
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

  const id = parseSettingId(params);
  if (!id) {
    return notFound();
  }

  const setting = findSetting(id);
  if (!setting) {
    return notFound();
  }

  return NextResponse.json({ data: serializeSettingEntity(setting) }, { status: 200 });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  return updateSettingHandler(request, params);
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  return updateSettingHandler(request, params);
}

async function updateSettingHandler(request: NextRequest, params: { id: string }): Promise<NextResponse> {
  try {
    await guard(request);
  } catch (response) {
    return response as NextResponse;
  }

  const id = parseSettingId(params);
  if (!id) {
    return notFound();
  }

  const setting = findSetting(id);
  if (!setting) {
    return notFound();
  }

  const json = await request.json().catch(() => ({}));
  const parsed = parseBody(settingUpdateSchema, json);
  if ("error" in parsed) {
    return buildValidationResponse(parsed.error);
  }

  const { key, value = null, type = null } = parsed.data;

  const errors: Record<string, string[]> = {};
  if (key !== undefined && settingKeyExists(key, setting.id)) {
    errors.key = ["The key has already been taken."];
  }

  if (Object.keys(errors).length > 0) {
    return buildValidationResponse(errors);
  }

  const updates: Parameters<typeof updateSetting>[1] = {};
  if (key !== undefined) {
    updates.key = key;
  }
  if (value !== undefined) {
    updates.value = value;
  }
  if (type !== undefined) {
    updates.type = type;
  }

  const updated = updateSetting(setting.id, updates)!;
  return NextResponse.json({ data: serializeSettingEntity(updated) }, { status: 200 });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  try {
    await guard(request);
  } catch (response) {
    return response as NextResponse;
  }

  const id = parseSettingId(params);
  if (!id) {
    return notFound();
  }

  const setting = findSetting(id);
  if (!setting) {
    return notFound();
  }

  deleteSetting(id);
  return new NextResponse(null, { status: 204 });
}
