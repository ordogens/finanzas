import type { AuthMode } from "./types";

type AuthModeTabsProps = {
  mode: AuthMode;
  onChangeMode: (mode: AuthMode) => void;
};

export const AuthModeTabs = ({ mode, onChangeMode }: AuthModeTabsProps) => (
  <div className="mt-6 rounded-3xl bg-slate-800/75 p-1 shadow-inner ring-1 ring-slate-700">
    <div className="grid grid-cols-2 gap-1">
      <button
        type="button"
        onClick={() => onChangeMode("login")}
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
        onClick={() => onChangeMode("register")}
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
);
