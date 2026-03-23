import { createContext } from "react";
import type {
  AuthActionResult,
  AuthUser,
  LoginValues,
  RegisterValues,
} from "../types/auth";

export type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  login: (values: LoginValues) => Promise<AuthActionResult>;
  register: (values: RegisterValues) => Promise<AuthActionResult>;
  loginWithGoogle: () => Promise<AuthActionResult>;
  logout: () => void;
  clearAuthError: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
