import { z } from "zod";
import {
  StoredPermission,
  StoredProfile,
  StoredRole,
  StoredSetting,
  StoredTeam,
  StoredUser,
  attachProfileToUser,
  findPermission,
  findProfile,
  findRole,
  findSetting,
  findTeam,
  findUser,
  listPermissions,
  listProfiles,
  listRoles,
  listSettings,
  listTeams,
  syncUserRoles,
  syncUserTeams,
} from "@/app/api/admin/_data/store";

const teamMembershipSchema = z.object({
  id: z.number().int().positive(),
  role: z.string().min(1),
});

const profilePayloadSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
  meta: z.record(z.string(), z.unknown()).optional(),
});

export const userCreateSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  roles: z.array(z.number().int().positive()).optional(),
  teams: z.array(teamMembershipSchema).optional(),
  profile: profilePayloadSchema.optional(),
});

export const userUpdateSchema = userCreateSchema
  .omit({ password: true })
  .extend({ password: z.string().min(6).optional() })
  .partial({ name: true, email: true });

export const roleCreateSchema = z.object({
  name: z.string().min(1),
  display_name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  permissions: z.array(z.number().int().positive()).optional(),
});

export const roleUpdateSchema = roleCreateSchema.partial({
  name: true,
  display_name: true,
  description: true,
});

export const permissionCreateSchema = z.object({
  name: z.string().min(1),
  display_name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
});

export const permissionUpdateSchema = permissionCreateSchema.partial({
  name: true,
  display_name: true,
  description: true,
});

export const profileCreateSchema = z.object({
  user_id: z.number().int().positive(),
  name: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
  meta: z.record(z.string(), z.unknown()).optional(),
});

export const profileUpdateSchema = profileCreateSchema.partial({
  user_id: true,
  name: true,
  phone: true,
  meta: true,
});

export const teamCreateSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1).optional(),
  members: z.array(teamMembershipSchema).optional(),
});

export const teamUpdateSchema = teamCreateSchema.partial({
  name: true,
  description: true,
  members: true,
});

export const settingCreateSchema = z.object({
  key: z.string().min(1),
  value: z.string().nullable().optional(),
  type: z.string().nullable().optional(),
});

export const settingUpdateSchema = settingCreateSchema.partial({
  key: true,
  value: true,
  type: true,
});

type SerializedPermission = StoredPermission;

type SerializedRole = StoredRole & {
  permissions: SerializedPermission[];
};

type SerializedTeamMember = {
  user: Pick<StoredUser, "id" | "name" | "email">;
  role: string;
};

type SerializedTeam = {
  id: number;
  name: string;
  description?: string;
  members: SerializedTeamMember[];
};

type SerializedProfile = StoredProfile & { user: Pick<StoredUser, "id" | "name" | "email"> | null };

type SerializedUser = {
  id: number;
  name: string;
  email: string;
  roles: SerializedRole[];
  teams: Array<{ id: number; name: string; description?: string; role: string }>;
  profile: SerializedProfile | null;
};

type SerializedSetting = StoredSetting;

function serializePermission(permission: StoredPermission): SerializedPermission {
  //1.- Return a shallow copy so responses remain immutable outside the store.
  return { ...permission };
}

function serializeRole(role: StoredRole): SerializedRole {
  //1.- Expand permission ids into full permission objects for consumers.
  const permissions = role.permissionIds
    .map((id) => findPermission(id))
    .filter((permission): permission is StoredPermission => Boolean(permission))
    .map(serializePermission);
  return { ...role, permissions };
}

function serializeTeam(team: StoredTeam): SerializedTeam {
  //1.- Embed minimal user data for each team member entry.
  const members = team.members
    .map((member) => {
      const user = findUser(member.userId);
      if (!user) {
        return null;
      }
      return {
        user: { id: user.id, name: user.name, email: user.email },
        role: member.role,
      };
    })
    .filter((member): member is SerializedTeamMember => Boolean(member));
  return {
    id: team.id,
    name: team.name,
    description: team.description,
    members,
  };
}

function serializeProfile(profile: StoredProfile | undefined): SerializedProfile | null {
  //1.- Normalize optional profile relationships into a nullable structure with user context.
  if (!profile) {
    return null;
  }
  const user = findUser(profile.userId);
  return { ...profile, user: user ? { id: user.id, name: user.name, email: user.email } : null };
}

export function serializeUser(user: StoredUser): SerializedUser {
  //1.- Expand role identifiers into the hydrated role objects.
  const roles = user.roleIds
    .map((id) => findRole(id))
    .filter((role): role is StoredRole => Boolean(role))
    .map(serializeRole);

  //2.- Expand team memberships with the related team details.
  const teams = user.teamMemberships.reduce<Array<{ id: number; name: string; description?: string; role: string }>>(
    (accumulator, membership) => {
      const team = findTeam(membership.teamId);
      if (team) {
        accumulator.push({
          id: team.id,
          name: team.name,
          description: team.description,
          role: membership.role,
        });
      }
      return accumulator;
    },
    [],
  );

  //3.- Attach the optional profile information for completeness.
  const profile = serializeProfile(user.profileId ? findProfile(user.profileId) : undefined);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    roles,
    teams,
    profile,
  };
}

export function serializeRoleWithPermissions(role: StoredRole): SerializedRole {
  //1.- Public wrapper for role serialization used by the API routes.
  return serializeRole(role);
}

export function serializePermissionCollection(): SerializedPermission[] {
  //1.- Provide an ordered permission list for the listing endpoint.
  return listPermissions().map(serializePermission);
}

export function serializeRoleCollection(): SerializedRole[] {
  //1.- Provide the full role collection with permission relationships.
  return listRoles().map(serializeRole);
}

export function serializeTeamCollection(): SerializedTeam[] {
  //1.- Provide teams with hydrated member references.
  return listTeams().map(serializeTeam);
}

export function serializeTeamEntity(team: StoredTeam): SerializedTeam {
  //1.- Expose a single team serialization helper for detail routes.
  return serializeTeam(team);
}

export function serializeProfileCollection(): SerializedProfile[] {
  //1.- Provide profiles with their owning user relationship hydrated.
  return listProfiles()
    .map((profile) => serializeProfile(profile)!)
    .filter((profile): profile is SerializedProfile => Boolean(profile));
}

export function serializeProfileEntity(profile: StoredProfile): SerializedProfile {
  //1.- Expose a single profile serialization helper for detail routes.
  return serializeProfile(profile)!;
}

export function serializeSettings(): SerializedSetting[] {
  //1.- Return ordered settings copies for predictable client consumption.
  return listSettings().map((setting) => ({ ...setting }));
}

export function serializeSettingEntity(setting: StoredSetting): SerializedSetting {
  //1.- Provide a helper for single setting serialization.
  return { ...setting };
}

export function handleUserRelationships(user: StoredUser, roleIds: number[] | undefined, teams: { id: number; role: string }[] | undefined): void {
  //1.- Sync roles when an explicit array is provided.
  if (roleIds) {
    syncUserRoles(user.id, roleIds);
  }

  //2.- Sync teams when membership payloads are present.
  if (teams) {
    syncUserTeams(
      user.id,
      teams.map((item) => ({ teamId: item.id, role: item.role })),
    );
  }
}

export function handleUserProfile(user: StoredUser, profilePayload: z.infer<typeof profilePayloadSchema> | undefined, create: (payload: Omit<StoredProfile, "id">) => StoredProfile, update: (id: number, payload: Partial<Omit<StoredProfile, "id">>) => StoredProfile | undefined): void {
  //1.- Skip work when the request omits profile data entirely.
  if (!profilePayload) {
    return;
  }

  //2.- Create or update the profile depending on whether one already exists.
  if (user.profileId) {
    update(user.profileId, profilePayload);
  } else {
    const profile = create({ userId: user.id, ...profilePayload });
    attachProfileToUser(user.id, profile.id);
  }
}

export type ValidationResult<T> = { data: T } | { error: { [key: string]: string[] } };

export function parseBody<T extends z.ZodTypeAny>(schema: T, body: unknown): ValidationResult<z.infer<T>> {
  //1.- Attempt to parse the incoming payload with the provided schema.
  const result = schema.safeParse(body);
  if (!result.success) {
    const errors: Record<string, string[]> = {};
    result.error.issues.forEach((issue) => {
      const path = issue.path.join(".") || "non_field_errors";
      errors[path] = [...(errors[path] ?? []), issue.message];
    });
    return { error: errors };
  }
  return { data: result.data };
}

export function validationError(errors: Record<string, string[]>) {
  //1.- Format validation errors to align with Laravel's default JSON structure.
  return {
    message: "The given data was invalid.",
    errors,
  };
}
