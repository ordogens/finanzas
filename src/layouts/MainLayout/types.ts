import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import type { AuthUser } from "../../types/auth";

export type MainLayoutProps = {
  children: ReactNode;
};

export type MenuItem = {
  label: string;
  path: string;
  icon: LucideIcon;
};

export type MainLayoutHeaderProps = {
  isMenuOpen: boolean;
  isAuthenticated: boolean;
  user: AuthUser | null;
  onToggleMenu: () => void;
  onNavigate: (path: string) => void;
  onOpenAuthModal: () => void;
  onLogout: () => void;
  menuRef: React.RefObject<HTMLDivElement | null>;
};
