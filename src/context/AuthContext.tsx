import { useCallback, useMemo, useState, type ReactNode } from "react";
import type {
  AuthUser,
  LoginValues,
  RegisterValues,
  StoredAuthUser,
} from "../types/auth";
import { AuthContext, type AuthContextValue } from "./authStore";

const AUTH_USERS_STORAGE_KEY = "monify-auth-users";
const AUTH_SESSION_STORAGE_KEY = "monify-auth-session";

const sanitizeEmail = (email: string) => email.trim().toLowerCase();
const sanitizeName = (name: string) => name.trim().replace(/\s+/g, " ");

const removePasswordFromUser = (user: StoredAuthUser): AuthUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  provider: user.provider,
  createdAt: user.createdAt,
});

const readStoredUsers = (): StoredAuthUser[] => {
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

const readStoredSession = (): AuthUser | null => {
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

const writeStoredUsers = (users: StoredAuthUser[]) => {
  window.localStorage.setItem(AUTH_USERS_STORAGE_KEY, JSON.stringify(users));
};

const writeStoredSession = (user: AuthUser | null) => {
  if (user) {
    window.localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(user));
    return;
  }

  window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(() => readStoredSession());
  const [isLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  const login = useCallback(async ({ email, password }: LoginValues) => {
    const normalizedEmail = sanitizeEmail(email);
    const normalizedPassword = password.trim();

    if (!normalizedEmail || !normalizedPassword) {
      setAuthError("Completa correo y contrasena para iniciar sesion.");
      return {
        ok: false,
        message: "Completa correo y contrasena para iniciar sesion.",
      };
    }

    const users = readStoredUsers();
    const matchedUser = users.find(
      (storedUser) =>
        sanitizeEmail(storedUser.email) === normalizedEmail &&
        storedUser.password === normalizedPassword
    );

    if (!matchedUser) {
      setAuthError("Correo o contrasena incorrectos.");
      return {
        ok: false,
        message: "Correo o contrasena incorrectos.",
      };
    }

    const sessionUser = removePasswordFromUser(matchedUser);
    writeStoredSession(sessionUser);
    setUser(sessionUser);
    setAuthError(null);
    return {
      ok: true,
      message: `Bienvenido otra vez, ${sessionUser.name}.`,
    };
  }, []);

  const register = useCallback(async ({
    name,
    email,
    password,
    confirmPassword,
  }: RegisterValues) => {
    const normalizedName = sanitizeName(name);
    const normalizedEmail = sanitizeEmail(email);
    const normalizedPassword = password.trim();
    const normalizedConfirmPassword = confirmPassword.trim();

    if (
      !normalizedName ||
      !normalizedEmail ||
      !normalizedPassword ||
      !normalizedConfirmPassword
    ) {
      setAuthError("Completa todos los campos para crear tu cuenta.");
      return {
        ok: false,
        message: "Completa todos los campos para crear tu cuenta.",
      };
    }

    if (normalizedPassword.length < 6) {
      setAuthError("La contrasena debe tener al menos 6 caracteres.");
      return {
        ok: false,
        message: "La contrasena debe tener al menos 6 caracteres.",
      };
    }

    if (normalizedPassword !== normalizedConfirmPassword) {
      setAuthError("Las contrasenas no coinciden.");
      return {
        ok: false,
        message: "Las contrasenas no coinciden.",
      };
    }

    const users = readStoredUsers();
    const emailExists = users.some(
      (storedUser) => sanitizeEmail(storedUser.email) === normalizedEmail
    );

    if (emailExists) {
      setAuthError("Ya existe una cuenta con ese correo.");
      return {
        ok: false,
        message: "Ya existe una cuenta con ese correo.",
      };
    }

    const nextStoredUser: StoredAuthUser = {
      id: `user-${Date.now()}`,
      name: normalizedName,
      email: normalizedEmail,
      password: normalizedPassword,
      provider: "email",
      createdAt: new Date().toISOString(),
    };

    const nextUsers = [nextStoredUser, ...users];
    writeStoredUsers(nextUsers);

    const sessionUser = removePasswordFromUser(nextStoredUser);
    writeStoredSession(sessionUser);
    setUser(sessionUser);
    setAuthError(null);
    return {
      ok: true,
      message: `Tu cuenta fue creada con exito, ${sessionUser.name}.`,
    };
  }, []);

  const loginWithGoogle = useCallback(async () => {
    const users = readStoredUsers();
    const googleEmail = "google@monify.local";
    const existingGoogleUser = users.find(
      (storedUser) => sanitizeEmail(storedUser.email) === googleEmail
    );

    const googleUser =
      existingGoogleUser ??
      ({
        id: `google-${Date.now()}`,
        name: "Usuario Google",
        email: googleEmail,
        password: "",
        provider: "google",
        createdAt: new Date().toISOString(),
      } satisfies StoredAuthUser);

    if (!existingGoogleUser) {
      writeStoredUsers([googleUser, ...users]);
    }

    const sessionUser = removePasswordFromUser(googleUser);
    writeStoredSession(sessionUser);
    setUser(sessionUser);
    setAuthError(null);
    return {
      ok: true,
      message: `Sesion iniciada con Google como ${sessionUser.name}.`,
    };
  }, []);

  const logout = useCallback(() => {
    writeStoredSession(null);
    setUser(null);
    setAuthError(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isLoading,
      authError,
      login,
      register,
      loginWithGoogle,
      logout,
      clearAuthError,
    }),
    [user, isLoading, authError, login, register, loginWithGoogle, logout, clearAuthError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
