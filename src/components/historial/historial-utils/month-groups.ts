import type { MovimientoItem, MovimientoSummary } from "../../../types/movimiento";
import type { MonthGroup } from "./types";

export const parseMovimientoDate = (value: string) => {
  const [day, month, year] = value.split("/").map(Number);

  if (!day || !month || !year) {
    return new Date();
  }

  return new Date(year, month - 1, day);
};

export const getMonthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const getMonthLabel = (date: Date) => {
  const label = new Intl.DateTimeFormat("es-CO", {
    month: "short",
    year: "numeric",
  }).format(date);

  return label.charAt(0).toUpperCase() + label.slice(1);
};

const createMonthRange = (movimientos: MovimientoItem[]) => {
  const currentDate = new Date();
  const dates = movimientos.map((movimiento) => parseMovimientoDate(movimiento.date));
  const earliestDate =
    dates.length > 0 ? new Date(Math.min(...dates.map(Number))) : currentDate;
  const startDate = new Date(earliestDate.getFullYear(), earliestDate.getMonth(), 1);
  const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const months: Date[] = [];

  for (
    const cursor = new Date(endDate);
    cursor >= startDate;
    cursor.setMonth(cursor.getMonth() - 1)
  ) {
    months.push(new Date(cursor));
  }

  return months;
};

const calculateSummary = (movimientos: MovimientoItem[]): MovimientoSummary => {
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

const calculateAhorro = (movimientos: MovimientoItem[]) =>
  movimientos
    .filter(
      (movimiento) =>
        movimiento.category === "ahorro" || movimiento.type === "saving"
    )
    .reduce((total, movimiento) => total + movimiento.amount, 0);

const calculateDeuda = (movimientos: MovimientoItem[]) =>
  movimientos
    .filter(
      (movimiento) =>
        movimiento.category === "abono-deuda" || movimiento.type === "debt"
    )
    .reduce((total, movimiento) => total + movimiento.amount, 0);

export const buildMonthGroups = (movimientos: MovimientoItem[]): MonthGroup[] => {
  const groupedMovimientos = movimientos.reduce<Record<string, MovimientoItem[]>>(
    (accumulator, movimiento) => {
      const movimientoDate = parseMovimientoDate(movimiento.date);
      const key = getMonthKey(movimientoDate);

      if (!accumulator[key]) {
        accumulator[key] = [];
      }

      accumulator[key].push(movimiento);

      return accumulator;
    },
    {}
  );

  return createMonthRange(movimientos).map((monthDate) => {
    const key = getMonthKey(monthDate);
    const monthMovimientos = (groupedMovimientos[key] ?? []).sort(
      (first, second) =>
        parseMovimientoDate(second.date).getTime() -
        parseMovimientoDate(first.date).getTime()
    );

    return {
      key,
      label: getMonthLabel(monthDate),
      movimientos: monthMovimientos,
      summary: calculateSummary(monthMovimientos),
      ahorro: calculateAhorro(monthMovimientos),
      deuda: calculateDeuda(monthMovimientos),
    };
  });
};
