import type { FormMovimientoValues } from "../../types/formMovimiento";
import type { MovimientoItem, MovimientoTipo } from "../../types/movimiento";
import { initialValues } from "./constants";

export const getFormInitialValues = (
  editingMovimiento: MovimientoItem | null
): FormMovimientoValues =>
  editingMovimiento
    ? {
        tipo: editingMovimiento.type,
        monto: String(editingMovimiento.amount),
        categoria: editingMovimiento.category,
        descripcion: editingMovimiento.description,
      }
    : initialValues;

export const getShortcutCategoryByType = (tipo: MovimientoTipo) =>
  tipo === "saving" ? "ahorro" : tipo === "debt" ? "abono-deuda" : "";
