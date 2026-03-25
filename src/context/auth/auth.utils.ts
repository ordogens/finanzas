import type { AuthUser, StoredAuthUser } from "../../types/auth";

export const sanitizeEmail = (email: string) => email.trim().toLowerCase();

export const sanitizeName = (name: string) => name.trim().replace(/\s+/g, " ");

export const removePasswordFromUser = (user: StoredAuthUser): AuthUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  provider: user.provider,
  createdAt: user.createdAt,
});
