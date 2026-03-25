import type { AuthUser, StoredAuthUser } from "../../types/auth";

const AUTH_USERS_STORAGE_KEY = "monify-auth-users";
const AUTH_SESSION_STORAGE_KEY = "monify-auth-session";

export const readStoredUsers = (): StoredAuthUser[] => {
  if (typeof window === "undefined") {
    return [];
  }

  const rawValue = window.localStorage.getItem(AUTH_USERS_STORAGE_KEY);

  if (!rawValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(rawValue) as StoredAuthUser[];
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
};

export const readStoredSession = (): AuthUser | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as AuthUser;
  } catch {
    return null;
  }
};

export const writeStoredUsers = (users: StoredAuthUser[]) => {
  window.localStorage.setItem(AUTH_USERS_STORAGE_KEY, JSON.stringify(users));
};

export const writeStoredSession = (user: AuthUser | null) => {
  if (user) {
    window.localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(user));
    return;
  }

  window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
};
