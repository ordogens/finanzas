export type AuthProvider = "email" | "google";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  provider: AuthProvider;
  createdAt: string;
};

export type StoredAuthUser = AuthUser & {
  password: string;
};

export type LoginValues = {
  email: string;
  password: string;
};

export type RegisterValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type AuthActionResult = {
  ok: boolean;
  message: string;
};
