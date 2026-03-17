import { useEffect, useRef, useState, type ReactNode } from "react";
import monify from "../assets/monify.png";
import { History, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Props = {
  children: ReactNode;
};

const menuItems = [
  {
    label: "Historial",
    path: "/historial",
    icon: History,
  },
];

export const MainLayout = ({ children }: Props) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="flex min-h-screen justify-center bg-gray-100">
      <div className="w-full max-w-md overflow-hidden rounded-xl bg-gray-200 shadow-lg">
        <header className="flex items-center justify-between border-b border-gray-300 bg-white px-4 py-3">
          <div className="flex items-center gap-3">
            <div
              onClick={() => navigate("/")}
              className="flex h-12 w-12 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-black bg-white"
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
              aria-label="Abrir menú"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {isMenuOpen ? (
              <div className="absolute right-0 top-14 z-20 w-60 overflow-hidden rounded-3xl border border-slate-200 bg-white p-2 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.45)]">
                <div className="mb-2 px-3 pt-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Menú
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                  
                  </p>
                </div>

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
                </div>
              </div>
            ) : null}
          </div>
        </header>

        <main className="space-y-4 p-4">{children}</main>
      </div>
    </div>
  );
};
