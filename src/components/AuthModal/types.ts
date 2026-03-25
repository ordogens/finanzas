import type { MouseEvent } from "react";
import type { LoginValues, RegisterValues } from "../../types/auth";

export type AuthMode = "login" | "register";

export type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export type AuthResultHandler = (
  event: MouseEvent<HTMLDivElement>
) => void;

export const initialLoginValues: LoginValues = {
  email: "",
  password: "",
};

export const initialRegisterValues: RegisterValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};
