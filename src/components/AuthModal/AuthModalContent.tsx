import { Chrome, X } from "lucide-react";
import type { FormEvent, MouseEvent } from "react";
import type { LoginValues, RegisterValues } from "../../types/auth";
import { AuthLoginForm } from "./AuthLoginForm";
import { AuthModeTabs } from "./AuthModeTabs";
import { AuthRegisterForm } from "./AuthRegisterForm";
import type { AuthMode } from "./types";

type AuthModalContentProps = {
  authError: string | null;
  mode: AuthMode;
  loginValues: LoginValues;
  registerValues: RegisterValues;
  onBackdropClick: (event: MouseEvent<HTMLDivElement>) => void;
  onClose: () => void;
  onChangeMode: (mode: AuthMode) => void;
  onGoogleLogin: () => void;
  onLoginSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onRegisterSubmit: (event: FormEvent<HTMLFormElement>) => void;
  setLoginValues: (updater: (current: LoginValues) => LoginValues) => void;
  setRegisterValues: (updater: (current: RegisterValues) => RegisterValues) => void;
};

export const AuthModalContent = ({
  authError,
  mode,
  loginValues,
  registerValues,
  onBackdropClick,
  onClose,
  onChangeMode,
  onGoogleLogin,
  onLoginSubmit,
  onRegisterSubmit,
  setLoginValues,
  setRegisterValues,
}: AuthModalContentProps) => (
  <div
    className="fixed inset-0 z-[100] overflow-y-auto bg-slate-950/55 backdrop-blur-sm"
    onClick={onBackdropClick}
  >
    <div className="grid min-h-full place-items-center px-4 py-6 sm:py-8">
      <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] bg-slate-900 shadow-[0_36px_120px_-40px_rgba(0,0,0,0.8)] ring-1 ring-slate-700">
        <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12)_0%,transparent_70%)]" />

        <div className="relative p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-400">
                Acceso Monify
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-100">
                Organiza tu plata sin perder el ritmo
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Entra para guardar tus movimientos, seguir tus gastos y mantener
                todo bajo control.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-700 bg-slate-800/80 text-slate-400 transition hover:border-slate-600 hover:text-slate-200"
              aria-label="Cerrar modal de autenticacion"
            >
              <X size={18} />
            </button>
          </div>

          <AuthModeTabs mode={mode} onChangeMode={onChangeMode} />

          <button
            type="button"
            onClick={onGoogleLogin}
            className="mt-5 flex w-full items-center justify-center gap-3 rounded-3xl border border-slate-700 bg-slate-800 px-4 py-3.5 text-sm font-semibold text-slate-200 transition hover:-translate-y-0.5 hover:border-slate-600"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-700 text-slate-300">
              <Chrome size={18} />
            </span>
            Continuar con Google
          </button>

          <div className="mt-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-700" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              o sigue con correo
            </span>
            <div className="h-px flex-1 bg-slate-700" />
          </div>

          {authError ? (
            <div className="mt-4 rounded-2xl border border-rose-800 bg-rose-950/50 px-4 py-3 text-sm font-medium text-rose-400">
              {authError}
            </div>
          ) : null}

          {mode === "login" ? (
            <AuthLoginForm
              values={loginValues}
              onChange={setLoginValues}
              onSubmit={onLoginSubmit}
            />
          ) : (
            <AuthRegisterForm
              values={registerValues}
              onChange={setRegisterValues}
              onSubmit={onRegisterSubmit}
            />
          )}
        </div>
      </div>
    </div>
  </div>
);
