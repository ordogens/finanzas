import type { MovimientoItem, MovimientoSummary } from "../../../types/movimiento";

export type MonthGroup = {
  key: string;
  label: string;
  movimientos: MovimientoItem[];
  summary: MovimientoSummary;
  ahorro: number;
  deuda: number;
};

export type ExpenseCategorySummary = {
  category: string;
  label: string;
  amount: number;
  percentage: number;
};

export type ExpenseMovementSummary = {
  id: number;
  label: string;
  categoryLabel: string;
  amount: number;
  percentage: number;
  date: string;
  type: "expense" | "debt";
};
