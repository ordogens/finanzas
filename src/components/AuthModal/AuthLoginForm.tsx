import { LockKeyhole, Mail } from "lucide-react";
import type { FormEvent } from "react";
import type { LoginValues } from "../../types/auth";
import { InputField } from "./InputField";

type AuthLoginFormProps = {
  values: LoginValues;
  onChange: (updater: (current: LoginValues) => LoginValues) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export const AuthLoginForm = ({
  values,
  onChange,
  onSubmit,
}: AuthLoginFormProps) => (
  <form className="mt-5 space-y-4" onSubmit={onSubmit}>
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
      placeholder="Tu contrasena"
      icon={<LockKeyhole size={18} />}
    />

    <div className="flex items-center justify-between gap-3 text-sm">
      <label className="flex items-center gap-2 text-slate-400">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-slate-600 text-sky-500 focus:ring-sky-400"
        />
        Recordarme
      </label>
      <button
        type="button"
        className="font-semibold text-sky-400 transition hover:text-sky-300"
      >
        Olvidaste tu contrasena?
      </button>
    </div>

    <button
      type="submit"
      className="w-full rounded-3xl bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_50%,#38bdf8_100%)] px-4 py-3.5 text-sm font-semibold text-white shadow-[0_20px_45px_-22px_rgba(37,99,235,0.75)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_50px_-20px_rgba(37,99,235,0.75)]"
    >
      Entrar a Monify
    </button>
  </form>
);
