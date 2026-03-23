import { useContext } from "react";
import type { FormMovimientoValues } from "../types/formMovimiento";
import type {
  AhorroSummary,
  DeudaSummary,
  MovimientoItem,
  MovimientoSummary,
} from "../types/movimiento";
import { FinanzasContext } from "./finanzasStore";

export type FinanzasContextValue = {
  movimientos: MovimientoItem[];
  editingMovimiento: MovimientoItem | null;
  summary: MovimientoSummary;
  ahorro: AhorroSummary;
  deuda: DeudaSummary;
  addMovimiento: (values: FormMovimientoValues) => void;
  updateMovimiento: (id: number, values: FormMovimientoValues) => void;
  deleteMovimiento: (id: number) => void;
  startEditing: (id: number) => void;
  cancelEditing: () => void;
  updateAhorroMeta: (value: number) => void;
  updateDeudaMeta: (value: number) => void;
};

export const useFinanzas = () => {
  const context = useContext(FinanzasContext);

  if (!context) {
    throw new Error("useFinanzas debe usarse dentro de FinanzasProvider");
  }

  return context;
};
