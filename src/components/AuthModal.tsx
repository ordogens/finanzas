import { Chrome, LockKeyhole, Mail, UserRound, X } from "lucide-react";
import {
  useEffect,
  useState,
  type FormEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import Swal from "sweetalert2";
import { useAuth } from "../context/useAuth";
import type { LoginValues, RegisterValues } from "../types/auth";

type AuthMode = "login" | "register";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const initialLoginValues = {
  email: "",
  password: "",
};

const initialRegisterValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const InputField = ({
  label,
  type,
  value,
  onChange,
  placeholder,
  icon,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon: ReactNode;
}) => (
  <label className="block space-y-2">
    <span className="text-sm font-semibold text-slate-200">{label}</span>
    <span className="flex items-center gap-3 rounded-2xl border border-slate-600 bg-slate-800/85 px-4 py-3 transition focus-within:border-sky-500 focus-within:ring-4 focus-within:ring-sky-500/20">
      <span className="text-slate-500">{icon}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
      />
    </span>
  </label>
);

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [loginValues, setLoginValues] = useState<LoginValues>(initialLoginValues);
  const [registerValues, setRegisterValues] =
    useState<RegisterValues>(initialRegisterValues);
  const {
    authError,
    clearAuthError,
    login,
    loginWithGoogle,
    register,
  } = useAuth();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    clearAuthError();
  }, [clearAuthError, isOpen, mode]);

  if (!isOpen) {
    return null;
  }

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const showSuccessAlert = async (title: string, text: string) => {
    await Swal.fire({
      title,
      text,
      icon: "success",
      confirmButtonText: "Listo",
      background: "#0f172a",
      color: "#f1f5f9",
      confirmButtonColor: "#2563eb",
      customClass: {
        popup: "rounded-[2rem]",
        confirmButton: "rounded-2xl",
      },
    });
  };

  const resetFormState = () => {
    setLoginValues(initialLoginValues);
    setRegisterValues(initialRegisterValues);
  };

  const handleLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await login(loginValues);

    if (!result.ok) {
      return;
    }

    await showSuccessAlert("Sesion iniciada", result.message);
    resetFormState();
    onClose();
  };

  const handleRegisterSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await register(registerValues);

    if (!result.ok) {
      return;
    }

    await showSuccessAlert("Cuenta creada", result.message);
    resetFormState();
    onClose();
  };

  const handleGoogleLogin = async () => {
    const result = await loginWithGoogle();

    if (!result.ok) {
      return;
    }

    await showSuccessAlert("Google conectado", result.message);
    resetFormState();
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] bg-slate-950/55 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="grid min-h-full place-items-center px-4 py-6">
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

            <div className="mt-6 rounded-3xl bg-slate-800/75 p-1 shadow-inner ring-1 ring-slate-700">
              <div className="grid grid-cols-2 gap-1">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className={`rounded-[1.25rem] px-4 py-3 text-sm font-semibold transition ${
                    mode === "login"
                      ? "bg-slate-950 text-white shadow-lg"
                      : "text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  Iniciar sesion
                </button>
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className={`rounded-[1.25rem] px-4 py-3 text-sm font-semibold transition ${
                    mode === "register"
                      ? "bg-slate-950 text-white shadow-lg"
                      : "text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  Registrarse
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
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
              <form className="mt-5 space-y-4" onSubmit={handleLoginSubmit}>
                <InputField
                  label="Correo"
                  type="email"
                  value={loginValues.email}
                  onChange={(value) =>
                    setLoginValues((current) => ({ ...current, email: value }))
                  }
                  placeholder="tucorreo@monify.com"
                  icon={<Mail size={18} />}
                />
                <InputField
                  label="Contrasena"
                  type="password"
                  value={loginValues.password}
                  onChange={(value) =>
                    setLoginValues((current) => ({
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
            ) : (
              <form className="mt-5 space-y-4" onSubmit={handleRegisterSubmit}>
                <InputField
                  label="Nombre"
                  type="text"
                  value={registerValues.name}
                  onChange={(value) =>
                    setRegisterValues((current) => ({ ...current, name: value }))
                  }
                  placeholder="Como te llamas?"
                  icon={<UserRound size={18} />}
                />
                <InputField
                  label="Correo"
                  type="email"
                  value={registerValues.email}
                  onChange={(value) =>
                    setRegisterValues((current) => ({ ...current, email: value }))
                  }
                  placeholder="tucorreo@monify.com"
                  icon={<Mail size={18} />}
                />
                <InputField
                  label="Contrasena"
                  type="password"
                  value={registerValues.password}
                  onChange={(value) =>
                    setRegisterValues((current) => ({
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
                  value={registerValues.confirmPassword}
                  onChange={(value) =>
                    setRegisterValues((current) => ({
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
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
