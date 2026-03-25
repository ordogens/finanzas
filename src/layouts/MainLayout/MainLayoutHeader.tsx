import { Menu, X } from "lucide-react";
import monify from "../../assets/monify.png";
import { MainLayoutMenu } from "./MainLayoutMenu";
import type { MainLayoutHeaderProps } from "./types";

export const MainLayoutHeader = ({
  isMenuOpen,
  isAuthenticated,
  user,
  onToggleMenu,
  onNavigate,
  onOpenAuthModal,
  onLogout,
  menuRef,
}: MainLayoutHeaderProps) => (
  <header className="flex items-center justify-between border-b border-blue-400/60 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 px-4 py-3 shadow-[0_18px_40px_-28px_rgba(37,99,235,0.7)]">
    <div className="flex items-center gap-3">
      <div
        onClick={() => onNavigate("/")}
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
        onClick={onToggleMenu}
        className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-white shadow-sm backdrop-blur-sm transition hover:bg-white/25"
        aria-label="Abrir menu"
        aria-expanded={isMenuOpen}
      >
        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {isMenuOpen ? (
        <MainLayoutMenu
          isAuthenticated={isAuthenticated}
          user={user}
          onNavigate={onNavigate}
          onOpenAuthModal={onOpenAuthModal}
          onLogout={onLogout}
        />
      ) : null}
    </div>
  </header>
);
