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
    <div className="flex min-h-screen justify-center bg-gray-100">
      <div className="w-full max-w-md overflow-hidden rounded-xl bg-gray-200 shadow-lg">
        <header className="flex items-center justify-between border-gray-300 bg-white px-4 py-3 shadow-md">
          <div className="flex items-center gap-3">
            <div
              onClick={() => handleNavigate("/")}
              className="flex h-12 w-12 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-white"
            >
              <img
                src={monify}
                alt="Logo de Monify"
                className="h-full w-full object-cover object-center"
              />
            </div>

            <h1 className="text-lg font-bold text-gray-800">Monify</h1>
          </div>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsMenuOpen((current) => !current)}
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:border-gray-300 hover:text-gray-700"
              aria-label="Abrir menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {isMenuOpen ? (
              <div className="absolute right-0 top-14 z-20 w-60 overflow-hidden rounded-3xl border border-slate-200 bg-white p-2 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.45)]">
                <div className="mb-2 px-3 pt-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Menu
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Muevete por la app o entra a tu cuenta.
                  </p>
                </div>

                {isAuthenticated && user ? (
                  <div className="mb-2 rounded-3xl bg-sky-50 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-500">
                      Sesion activa
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-500">{user.email}</p>
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
                        className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                      >
                        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
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
                      className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                        <LogOut size={18} />
                      </span>
                      <span>Cerrar sesion</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleOpenAuthModal}
                      className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
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

        <main className="space-y-4 p-4">{children}</main>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};
