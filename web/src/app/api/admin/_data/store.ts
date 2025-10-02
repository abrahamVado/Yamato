export type StoredPermission = {
  id: number;
  name: string;
  display_name?: string;
  description?: string;
};

export type StoredRole = {
  id: number;
  name: string;
  display_name?: string;
  description?: string;
  permissionIds: number[];
};

export type TeamMember = {
  userId: number;
  role: string;
};

export type StoredTeam = {
  id: number;
  name: string;
  description?: string;
  members: TeamMember[];
};

export type StoredProfile = {
  id: number;
  userId: number;
  name?: string;
  phone?: string;
  meta?: Record<string, unknown>;
};

export type StoredUser = {
  id: number;
  name: string;
  email: string;
  password: string;
  roleIds: number[];
  teamMemberships: { teamId: number; role: string }[];
  profileId: number | null;
};

export type StoredSetting = {
  id: number;
  key: string;
  value: string | null;
  type: string | null;
};

type Store = {
  permissions: StoredPermission[];
  roles: StoredRole[];
  teams: StoredTeam[];
  profiles: StoredProfile[];
  users: StoredUser[];
  settings: StoredSetting[];
  counters: {
    permission: number;
    role: number;
    team: number;
    profile: number;
    user: number;
    setting: number;
  };
};

const store: Store = {
  permissions: [
    { id: 1, name: "users.read", display_name: "View users" },
    { id: 2, name: "users.write", display_name: "Manage users" },
    { id: 3, name: "teams.read", display_name: "View teams" },
    { id: 4, name: "teams.write", display_name: "Manage teams" },
  ],
  roles: [
    { id: 1, name: "admin", display_name: "Administrator", permissionIds: [1, 2, 3, 4] },
    { id: 2, name: "manager", display_name: "Manager", permissionIds: [1, 3] },
    { id: 3, name: "member", display_name: "Member", permissionIds: [3] },
  ],
  teams: [
    {
      id: 1,
      name: "Engineering",
      description: "Core product builders",
      members: [],
    },
  ],
  profiles: [],
  users: [],
  settings: [
    { id: 1, key: "app.name", value: "Yamato", type: "string" },
    { id: 2, key: "app.locale", value: "en", type: "string" },
  ],
  counters: {
    permission: 5,
    role: 4,
    team: 2,
    profile: 1,
    user: 2,
    setting: 3,
  },
};

//1.- Seed the default demo user after related structures are defined.
store.users.push({
  id: 1,
  name: "Demo User",
  email: "demo.user@example.com",
  password: "secret",
  roleIds: [1],
  teamMemberships: [{ teamId: 1, role: "owner" }],
  profileId: null,
});
store.teams[0].members.push({ userId: 1, role: "owner" });

function nextId(counter: keyof Store["counters"]): number {
  //1.- Increment the requested counter and return the new identifier.
  const value = store.counters[counter];
  store.counters[counter] += 1;
  return value;
}

export function listPermissions(): StoredPermission[] {
  //1.- Return permissions ordered alphabetically by key name.
  return [...store.permissions].sort((a, b) => a.name.localeCompare(b.name));
}

export function listRoles(): StoredRole[] {
  //1.- Expose all roles without mutating the in-memory store.
  return [...store.roles];
}

export function listTeams(): StoredTeam[] {
  //1.- Return teams with their member arrays intact for serialization.
  return [...store.teams];
}

export function listProfiles(): StoredProfile[] {
  //1.- Provide a shallow copy of profiles to prevent accidental mutation.
  return [...store.profiles];
}

export function listUsers(): StoredUser[] {
  //1.- Expose users from the store for serialization by the API routes.
  return [...store.users];
}

export function listSettings(): StoredSetting[] {
  //1.- Return settings ordered by key for deterministic responses.
  return [...store.settings].sort((a, b) => a.key.localeCompare(b.key));
}

export function findPermission(id: number): StoredPermission | undefined {
  //1.- Locate a permission by its identifier.
  return store.permissions.find((permission) => permission.id === id);
}

export function findRole(id: number): StoredRole | undefined {
  //1.- Locate a role within the store using its identifier.
  return store.roles.find((role) => role.id === id);
}

export function findTeam(id: number): StoredTeam | undefined {
  //1.- Locate a team using the in-memory list.
  return store.teams.find((team) => team.id === id);
}

export function findProfile(id: number): StoredProfile | undefined {
  //1.- Locate a profile by its identifier.
  return store.profiles.find((profile) => profile.id === id);
}

export function findProfileByUserId(userId: number): StoredProfile | undefined {
  //1.- Check for a profile that references the provided user id.
  return store.profiles.find((profile) => profile.userId === userId);
}

export function findUser(id: number): StoredUser | undefined {
  //1.- Locate a user record via the stored array.
  return store.users.find((user) => user.id === id);
}

export function findSetting(id: number): StoredSetting | undefined {
  //1.- Locate a setting record by its identifier.
  return store.settings.find((setting) => setting.id === id);
}

export function emailExists(email: string, ignoreId?: number): boolean {
  //1.- Confirm if an email address is already present in the user store.
  return store.users.some((user) => user.email === email && user.id !== ignoreId);
}

export function roleNameExists(name: string, ignoreId?: number): boolean {
  //1.- Confirm whether a role name already exists, excluding an optional id.
  return store.roles.some((role) => role.name === name && role.id !== ignoreId);
}

export function permissionNameExists(name: string, ignoreId?: number): boolean {
  //1.- Confirm whether a permission name already exists, excluding an optional id.
  return store.permissions.some((permission) => permission.name === name && permission.id !== ignoreId);
}

export function teamNameExists(name: string, ignoreId?: number): boolean {
  //1.- Check whether a team name is already used within the store.
  return store.teams.some((team) => team.name === name && team.id !== ignoreId);
}

export function settingKeyExists(key: string, ignoreId?: number): boolean {
  //1.- Check whether a setting key already exists in the store.
  return store.settings.some((setting) => setting.key === key && setting.id !== ignoreId);
}

export function profileUserExists(userId: number, ignoreId?: number): boolean {
  //1.- Determine whether a profile already references the provided user id.
  return store.profiles.some((profile) => profile.userId === userId && profile.id !== ignoreId);
}

export function createPermission(payload: Omit<StoredPermission, "id">): StoredPermission {
  //1.- Persist the permission with a new identifier in the in-memory store.
  const permission: StoredPermission = { ...payload, id: nextId("permission") };
  store.permissions.push(permission);
  return permission;
}

export function updatePermission(id: number, payload: Partial<Omit<StoredPermission, "id">>): StoredPermission | undefined {
  //1.- Locate the permission and merge incoming fields when present.
  const permission = findPermission(id);
  if (!permission) {
    return undefined;
  }
  Object.assign(permission, payload);
  return permission;
}

export function deletePermission(id: number): boolean {
  //1.- Remove the permission and sync roles that reference it.
  const index = store.permissions.findIndex((permission) => permission.id === id);
  if (index === -1) {
    return false;
  }
  store.permissions.splice(index, 1);
  store.roles.forEach((role) => {
    role.permissionIds = role.permissionIds.filter((permissionId) => permissionId !== id);
  });
  return true;
}

export function createRole(payload: Omit<StoredRole, "id">): StoredRole {
  //1.- Attach a new id and store the role definition.
  const role: StoredRole = { ...payload, id: nextId("role") };
  store.roles.push(role);
  return role;
}

export function updateRole(id: number, payload: Partial<Omit<StoredRole, "id">>): StoredRole | undefined {
  //1.- Merge incoming fields into the existing role.
  const role = findRole(id);
  if (!role) {
    return undefined;
  }
  Object.assign(role, payload);
  return role;
}

export function deleteRole(id: number): boolean {
  //1.- Remove the role and clean up user role assignments.
  const index = store.roles.findIndex((role) => role.id === id);
  if (index === -1) {
    return false;
  }
  store.roles.splice(index, 1);
  store.users.forEach((user) => {
    user.roleIds = user.roleIds.filter((roleId) => roleId !== id);
  });
  return true;
}

export function createTeam(payload: Omit<StoredTeam, "id">): StoredTeam {
  //1.- Assign an id and push the team into the store.
  const team: StoredTeam = { ...payload, id: nextId("team") };
  store.teams.push(team);
  return team;
}

export function updateTeam(id: number, payload: Partial<Omit<StoredTeam, "id">>): StoredTeam | undefined {
  //1.- Merge incoming changes into the stored team record.
  const team = findTeam(id);
  if (!team) {
    return undefined;
  }
  Object.assign(team, payload);
  return team;
}

export function deleteTeam(id: number): boolean {
  //1.- Remove the team and detach memberships from users.
  const index = store.teams.findIndex((team) => team.id === id);
  if (index === -1) {
    return false;
  }
  store.teams.splice(index, 1);
  store.users.forEach((user) => {
    user.teamMemberships = user.teamMemberships.filter((membership) => membership.teamId !== id);
  });
  return true;
}

export function createProfile(payload: Omit<StoredProfile, "id">): StoredProfile {
  //1.- Persist the profile and return the stored record.
  const profile: StoredProfile = { ...payload, id: nextId("profile") };
  store.profiles.push(profile);
  return profile;
}

export function updateProfile(id: number, payload: Partial<Omit<StoredProfile, "id">>): StoredProfile | undefined {
  //1.- Locate and mutate the profile with the provided fields.
  const profile = findProfile(id);
  if (!profile) {
    return undefined;
  }
  Object.assign(profile, payload);
  return profile;
}

export function deleteProfile(id: number): boolean {
  //1.- Remove the profile and unlink it from any associated user.
  const index = store.profiles.findIndex((profile) => profile.id === id);
  if (index === -1) {
    return false;
  }
  const [profile] = store.profiles.splice(index, 1);
  const user = findUser(profile.userId);
  if (user) {
    user.profileId = null;
  }
  return true;
}

export function createUser(payload: Omit<StoredUser, "id">): StoredUser {
  //1.- Store the user with a generated identifier.
  const user: StoredUser = { ...payload, id: nextId("user") };
  store.users.push(user);
  return user;
}

export function updateUser(id: number, payload: Partial<Omit<StoredUser, "id">>): StoredUser | undefined {
  //1.- Merge incoming values into the stored user record.
  const user = findUser(id);
  if (!user) {
    return undefined;
  }
  Object.assign(user, payload);
  return user;
}

export function deleteUser(id: number): boolean {
  //1.- Remove the user, clean memberships, and delete any attached profile.
  const index = store.users.findIndex((user) => user.id === id);
  if (index === -1) {
    return false;
  }
  const [user] = store.users.splice(index, 1);
  store.teams.forEach((team) => {
    team.members = team.members.filter((member) => member.userId !== id);
  });
  if (user.profileId) {
    deleteProfile(user.profileId);
  }
  return true;
}

export function createSetting(payload: Omit<StoredSetting, "id">): StoredSetting {
  //1.- Persist the setting and expose the stored record.
  const setting: StoredSetting = { ...payload, id: nextId("setting") };
  store.settings.push(setting);
  return setting;
}

export function updateSetting(id: number, payload: Partial<Omit<StoredSetting, "id">>): StoredSetting | undefined {
  //1.- Merge new fields into the stored setting when present.
  const setting = findSetting(id);
  if (!setting) {
    return undefined;
  }
  Object.assign(setting, payload);
  return setting;
}

export function deleteSetting(id: number): boolean {
  //1.- Remove the setting record from the in-memory array.
  const index = store.settings.findIndex((setting) => setting.id === id);
  if (index === -1) {
    return false;
  }
  store.settings.splice(index, 1);
  return true;
}

export function syncUserRoles(userId: number, roleIds: number[]): void {
  //1.- Update the assigned role ids on the specified user.
  const user = findUser(userId);
  if (user) {
    user.roleIds = [...roleIds];
  }
}

export function syncUserTeams(userId: number, teams: { teamId: number; role: string }[]): void {
  //1.- Replace the stored team memberships and update the team member lists.
  const user = findUser(userId);
  if (!user) {
    return;
  }
  user.teamMemberships = [...teams];
  store.teams.forEach((team) => {
    team.members = team.members.filter((member) => member.userId !== userId);
  });
  teams.forEach((membership) => {
    const team = findTeam(membership.teamId);
    if (team) {
      team.members.push({ userId, role: membership.role });
    }
  });
}

export function attachProfileToUser(userId: number, profileId: number | null): void {
  //1.- Set the foreign key on the user for the profile relationship.
  const user = findUser(userId);
  if (user) {
    user.profileId = profileId;
  }
}

export function syncTeamMembers(teamId: number, members: TeamMember[]): void {
  //1.- Replace the stored team members and update user memberships accordingly.
  const team = findTeam(teamId);
  if (!team) {
    return;
  }
  team.members = [...members];

  store.users.forEach((user) => {
    user.teamMemberships = user.teamMemberships.filter((membership) => membership.teamId !== teamId);
  });

  members.forEach((member) => {
    const user = findUser(member.userId);
    if (user) {
      user.teamMemberships.push({ teamId, role: member.role });
    }
  });
}
