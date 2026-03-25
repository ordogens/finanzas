import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthModal } from "../../components/AuthModal";
import { useAuth } from "../../context/useAuth";
import { MainLayoutHeader } from "./MainLayoutHeader";
import type { MainLayoutProps } from "./types";
import { useMainLayoutMenu } from "./useMainLayoutMenu";

export const MainLayout = ({ children }: MainLayoutProps) => {
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { isMenuOpen, setIsMenuOpen, menuRef } = useMainLayoutMenu();
  const { isAuthenticated, logout, user } = useAuth();

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
      className="flex min-h-dvh justify-center bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.16),_transparent_30%),linear-gradient(180deg,#020617_0%,#0f172a_55%,#020617_100%)] sm:px-4 sm:py-5"
    >
      <div className="w-full max-w-md overflow-hidden bg-slate-900/95 sm:rounded-[28px] sm:border sm:border-slate-800/90 sm:shadow-[0_24px_60px_-30px_rgba(15,23,42,0.9)] sm:ring-1 sm:ring-white/5 sm:backdrop-blur-sm">
        <MainLayoutHeader
          isMenuOpen={isMenuOpen}
          isAuthenticated={isAuthenticated}
          user={user}
          onToggleMenu={() => setIsMenuOpen((current) => !current)}
          onNavigate={handleNavigate}
          onOpenAuthModal={handleOpenAuthModal}
          onLogout={handleLogout}
          menuRef={menuRef}
        />

        <main className="space-y-4 bg-transparent p-4">{children}</main>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};
