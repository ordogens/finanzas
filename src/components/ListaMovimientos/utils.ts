import { categoriasLabels } from "../../data/formMovimiento";
import type { MovimientoItem } from "../../types/movimiento";
import { categoryIconMap } from "./constants";

export const getAmountColor = (type: MovimientoItem["type"]) => {
  if (type === "income") {
    return "text-emerald-400";
  }

  if (type === "saving") {
    return "text-cyan-400";
  }

  if (type === "debt") {
    return "text-amber-400";
  }

  return "text-rose-400";
};

export const getAmountSign = (type: MovimientoItem["type"]) =>
  type === "income" ? "+" : "-";

export const getCategoryLabel = (category: string) =>
  categoriasLabels[category as keyof typeof categoriasLabels] ?? category;

export const getMovementIconKey = (category: string) =>
  categoryIconMap[category] ?? "basket";

export const getSecondaryText = (movimiento: MovimientoItem, label: string) =>
  movimiento.description.trim() ||
  (movimiento.type === "saving"
    ? "Transferencia a ahorro"
    : movimiento.type === "debt"
      ? "Abono a deuda"
      : label);

export const getMovementTypeLabel = (movimiento: MovimientoItem, label: string) =>
  movimiento.type === "saving"
    ? "Ahorro"
    : movimiento.type === "debt"
      ? "Deuda"
      : label;
