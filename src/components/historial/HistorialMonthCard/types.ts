import type { MonthGroup } from "../historial.utils";

export type HistorialMonthCardProps = {
  group: MonthGroup;
  isCurrentMonth: boolean;
  isOpen: boolean;
  onToggle: () => void;
};
