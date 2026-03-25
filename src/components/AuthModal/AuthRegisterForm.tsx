import { LockKeyhole, Mail, UserRound } from "lucide-react";
import type { FormEvent } from "react";
import type { RegisterValues } from "../../types/auth";
import { InputField } from "./InputField";

type AuthRegisterFormProps = {
  values: RegisterValues;
  onChange: (updater: (current: RegisterValues) => RegisterValues) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export const AuthRegisterForm = ({
  values,
  onChange,
  onSubmit,
}: AuthRegisterFormProps) => (
  <form className="mt-5 space-y-4" onSubmit={onSubmit}>
    <InputField
      label="Nombre"
      type="text"
      value={values.name}
      onChange={(value) => onChange((current) => ({ ...current, name: value }))}
      placeholder="Como te llamas?"
      icon={<UserRound size={18} />}
    />
    <InputField
      label="Correo"
      type="email"
      value={values.email}
      onChange={(value) => onChange((current) => ({ ...current, email: value }))}
      placeholder="tucorreo@monify.com"
      icon={<Mail size={18} />}
    />
    <InputField
      label="Contrasena"
      type="password"
      value={values.password}
      onChange={(value) =>
        onChange((current) => ({
          ...current,
          password: value,
        }))
      }
      placeholder="Crea una contrasena"
      icon={<LockKeyhole size={18} />}
    />
    <InputField
      label="Confirmar contrasena"
      type="password"
      value={values.confirmPassword}
      onChange={(value) =>
        onChange((current) => ({
          ...current,
          confirmPassword: value,
        }))
      }
      placeholder="Repite tu contrasena"
      icon={<LockKeyhole size={18} />}
    />

    <button
      type="submit"
      className="w-full rounded-3xl bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_50%,#38bdf8_100%)] px-4 py-3.5 text-sm font-semibold text-white shadow-[0_20px_45px_-22px_rgba(37,99,235,0.75)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_50px_-20px_rgba(37,99,235,0.75)]"
    >
      Crear cuenta
    </button>
  </form>
);
