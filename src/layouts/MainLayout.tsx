import { useEffect, useRef, useState, type ReactNode } from "react";
import { History, House, LogIn, LogOut, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import monify from "../assets/monify.png";
import { AuthModal } from "../components/AuthModal";
import { useAuth } from "../context/useAuth";

type Props = {
  children: ReactNode;
};

const menuItems = [
  {
    label: "Inicio",
    path: "/",
    icon: House,
  },
  {
    label: "Historial",
    path: "/historial",
    icon: History,
  },
];

export const MainLayout = ({ children }: Props) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, logout, user } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleOpenAuthModal = () => {
    setIsAuthModalOpen(true);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <div
      data-theme="dark"
      className="flex min-h-screen justify-center bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.16),_transparent_30%),linear-gradient(180deg,#020617_0%,#0f172a_55%,#020617_100%)] px-3 py-3 sm:px-4 sm:py-5"
    >
      <div className="w-full max-w-md overflow-hidden rounded-[28px] border border-slate-800/90 bg-slate-900/95 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.9)] ring-1 ring-white/5 backdrop-blur-sm">
        <header className="flex items-center justify-between border-b border-blue-400/60 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 px-4 py-3 shadow-[0_18px_40px_-28px_rgba(37,99,235,0.7)]">
          <div className="flex items-center gap-3">
            <div
              onClick={() => handleNavigate("/")}
              className="flex h-12 w-12 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-white/15 bg-slate-950 shadow-sm ring-1 ring-white/10"
            >
              <img
                src={monify}
                alt="Logo de Monify"
                className="h-full w-full object-cover object-center"
              />
            </div>
            <h1 className="text-lg font-bold text-white">Monify</h1>
          </div>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsMenuOpen((current) => !current)}
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-white shadow-sm backdrop-blur-sm transition hover:bg-white/25"
              aria-label="Abrir menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {isMenuOpen ? (
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
                    <p className="mt-1 text-sm font-semibold text-slate-100">
                      {user.name}
                    </p>
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
                        onClick={() => handleNavigate(item.path)}
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
                      onClick={handleLogout}
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
                      onClick={handleOpenAuthModal}
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
            ) : null}
          </div>
        </header>

        <main className="space-y-4 bg-transparent p-4">{children}</main>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};
