import { z } from "zod";

//1.- Mirror the backend validation rules so client-side forms stay consistent.
export const adminTeamMemberSchema = z.object({
  id: z.number().int().positive(),
  role: z.string().min(1),
  name: z.string().min(1).optional(),
});

export const adminProfileSchema = z.object({
  user_id: z.number().int().positive(),
  name: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
  meta: z.record(z.string(), z.unknown()).optional(),
});

export const adminUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  roles: z.array(z.number().int().positive()).optional(),
  teams: z.array(adminTeamMemberSchema).optional(),
  profile: adminProfileSchema.omit({ user_id: true }).optional(),
});

export const adminRoleSchema = z.object({
  name: z.string().min(1),
  display_name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  permissions: z.array(z.number().int().positive()).optional(),
});

export const adminPermissionSchema = z.object({
  name: z.string().min(1),
  display_name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
});

export const adminTeamSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1).optional(),
  members: z.array(adminTeamMemberSchema).optional(),
});

export const adminSettingSchema = z.object({
  key: z.string().min(1),
  value: z.string().nullable().optional(),
  type: z.string().nullable().optional(),
});
