import { NextRequest, NextResponse } from "next/server";
import { ensureSanctum } from "@/app/api/_lib/auth";
import { createSetting, settingKeyExists } from "@/app/api/admin/_data/store";
import {
  parseBody,
  serializeSettings,
  serializeSettingEntity,
  validationError,
} from "@/app/api/admin/_lib/validation";
import { settingCreateSchema } from "@/app/api/admin/_lib/validation";

function buildValidationResponse(errors: Record<string, string[]>) {
  //1.- Present validation errors in the Laravel-compatible format.
  return NextResponse.json(validationError(errors), { status: 422 });
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  //1.- Authenticate the caller before returning configuration data.
  const guard = ensureSanctum(request);
  if (guard) {
    return guard;
  }

  return NextResponse.json({ data: serializeSettings() }, { status: 200 });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  //1.- Protect the endpoint with Sanctum.
  const guard = ensureSanctum(request);
  if (guard) {
    return guard;
  }

  const json = await request.json().catch(() => ({}));
  const parsed = parseBody(settingCreateSchema, json);
  if ("error" in parsed) {
    return buildValidationResponse(parsed.error);
  }

  const { key, value = null, type = null } = parsed.data;

  const errors: Record<string, string[]> = {};
  if (settingKeyExists(key)) {
    errors.key = ["The key has already been taken."];
  }

  if (Object.keys(errors).length > 0) {
    return buildValidationResponse(errors);
  }

  const setting = createSetting({ key, value: value ?? null, type: type ?? null });
  return NextResponse.json({ data: serializeSettingEntity(setting) }, { status: 201 });
}
