import type {
  AhorroSummary,
  DeudaSummary,
  MovimientoItem,
  MovimientoSummary,
} from "../../types/movimiento";

export const normalizeMonto = (monto: string) => Number(monto.trim());

export const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);

export const calculateSummary = (
  movimientos: MovimientoItem[]
): MovimientoSummary => {
  const ingresos = movimientos
    .filter((movimiento) => movimiento.type === "income")
    .reduce((total, movimiento) => total + movimiento.amount, 0);

  const gastos = movimientos
    .filter((movimiento) => movimiento.type === "expense")
    .reduce((total, movimiento) => total + movimiento.amount, 0);

  const ahorroApartado = movimientos
    .filter((movimiento) => movimiento.type === "saving")
    .reduce((total, movimiento) => total + movimiento.amount, 0);

  const deudaApartada = movimientos
    .filter((movimiento) => movimiento.type === "debt")
    .reduce((total, movimiento) => total + movimiento.amount, 0);

  return {
    ingresos,
    gastos,
    balance: ingresos - gastos - ahorroApartado - deudaApartada,
  };
};

export const calculateAhorroSummary = (
  movimientos: MovimientoItem[],
  meta: number
): AhorroSummary => {
  const ahorrado = movimientos
    .filter(
      (movimiento) =>
        movimiento.category === "ahorro" || movimiento.type === "saving"
    )
    .reduce((total, movimiento) => total + movimiento.amount, 0);
  const sanitizedMeta = Math.max(meta, 0);
  const restante = Math.max(sanitizedMeta - ahorrado, 0);
  const progreso =
    sanitizedMeta > 0 ? Math.min((ahorrado / sanitizedMeta) * 100, 100) : 0;

  return {
    ahorrado,
    meta: sanitizedMeta,
    restante,
    progreso,
  };
};

export const calculateDeudaSummary = (
  movimientos: MovimientoItem[],
  meta: number
): DeudaSummary => {
  const abonado = movimientos
    .filter(
      (movimiento) =>
        movimiento.category === "abono-deuda" || movimiento.type === "debt"
    )
    .reduce((total, movimiento) => total + movimiento.amount, 0);
  const sanitizedMeta = Math.max(meta, 0);
  const restante = Math.max(sanitizedMeta - abonado, 0);
  const progreso =
    sanitizedMeta > 0 ? Math.min((abonado / sanitizedMeta) * 100, 100) : 0;

  return {
    abonado,
    meta: sanitizedMeta,
    restante,
    progreso,
  };
};
