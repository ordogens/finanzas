import { History, House } from "lucide-react";
import type { MenuItem } from "./types";

export const menuItems: MenuItem[] = [
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
