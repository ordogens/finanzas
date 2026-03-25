import type { FormMovimientoValues } from "../../types/formMovimiento";
import type { MovimientoTipo } from "../../types/movimiento";

export const initialValues: FormMovimientoValues = {
  tipo: "income",
  monto: "",
  categoria: "",
  descripcion: "",
};

export const labelsByType: Record<MovimientoTipo, string> = {
  income: "Ingreso",
  expense: "Gasto",
  saving: "Ahorro",
  debt: "Abono a deuda",
};
