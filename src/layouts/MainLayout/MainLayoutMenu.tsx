import { LogIn, LogOut } from "lucide-react";
import type { AuthUser } from "../../types/auth";
import { menuItems } from "./menuItems";

type MainLayoutMenuProps = {
  isAuthenticated: boolean;
  user: AuthUser | null;
  onNavigate: (path: string) => void;
  onOpenAuthModal: () => void;
  onLogout: () => void;
};

export const MainLayoutMenu = ({
  isAuthenticated,
  user,
  onNavigate,
  onOpenAuthModal,
  onLogout,
}: MainLayoutMenuProps) => (
  <div className="absolute right-0 top-14 z-20 w-60 overflow-hidden rounded-3xl border border-slate-700 bg-slate-800 p-2 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.6)]">
    <div className="mb-2 px-3 pt-2">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
        Menu
      </p>
      <p className="mt-1 text-sm text-slate-400">
        Muevete por la app o entra a tu cuenta.
      </p>
    </div>

    {isAuthenticated && user ? (
      <div className="mb-2 rounded-3xl bg-sky-950/40 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-400">
          Sesion activa
        </p>
        <p className="mt-1 text-sm font-semibold text-slate-100">{user.name}</p>
        <p className="text-xs text-slate-400">{user.email}</p>
      </div>
    ) : null}

    <div className="space-y-1">
      {menuItems.map((item) => {
        const Icon = item.icon;

        return (
          <button
            key={item.path}
            type="button"
            onClick={() => onNavigate(item.path)}
            className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-semibold text-slate-200 transition hover:bg-slate-700"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-700 text-slate-300">
              <Icon size={18} />
            </span>
            <span>{item.label}</span>
          </button>
        );
      })}

      {isAuthenticated ? (
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-semibold text-slate-200 transition hover:bg-slate-700"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-950/60 text-rose-400">
            <LogOut size={18} />
          </span>
          <span>Cerrar sesion</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={onOpenAuthModal}
          className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-semibold text-slate-200 transition hover:bg-slate-700"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-950/60 text-sky-400">
            <LogIn size={18} />
          </span>
          <span>Iniciar sesion</span>
        </button>
      )}
    </div>
  </div>
);
