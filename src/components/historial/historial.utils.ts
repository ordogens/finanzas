import { categoriasLabels } from "../../data/formMovimiento";
import type { MovimientoItem, MovimientoSummary } from "../../types/movimiento";

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

export const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

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

export const getBalanceTone = (balance: number) => {
  if (balance > 0) {
    return "text-emerald-400";
  }

  if (balance < 0) {
    return "text-rose-400";
  }

  return "text-slate-500";
};

export const getCategoryLabel = (category: string) =>
  categoriasLabels[category as keyof typeof categoriasLabels] ?? category;

export const buildExpenseCategorySummary = (
  movimientos: MovimientoItem[]
): ExpenseCategorySummary[] => {
  const expenseMovimientos = movimientos.filter(
    (movimiento) =>
      movimiento.type === "expense" || movimiento.type === "debt"
  );
  const totalExpenses = expenseMovimientos.reduce(
    (total, movimiento) => total + movimiento.amount,
    0
  );

  if (totalExpenses === 0) {
    return [];
  }

  const groupedExpenses = expenseMovimientos.reduce<Record<string, number>>(
    (accumulator, movimiento) => {
      accumulator[movimiento.category] =
        (accumulator[movimiento.category] ?? 0) + movimiento.amount;

      return accumulator;
    },
    {}
  );

  return Object.entries(groupedExpenses)
    .map(([category, amount]) => ({
      category,
      label: getCategoryLabel(category),
      amount,
      percentage: (amount / totalExpenses) * 100,
    }))
    .sort((first, second) => second.amount - first.amount);
};

export const buildExpenseMovementSummary = (
  movimientos: MovimientoItem[]
): ExpenseMovementSummary[] => {
  const expenseMovimientos = movimientos.filter(
    (movimiento) =>
      movimiento.type === "expense" || movimiento.type === "debt"
  );
  const totalExpenses = expenseMovimientos.reduce(
    (total, movimiento) => total + movimiento.amount,
    0
  );

  if (totalExpenses === 0) {
    return [];
  }

  return expenseMovimientos
    .map((movimiento) => {
      const categoryLabel = getCategoryLabel(movimiento.category);
      const description = movimiento.description.trim();
      const movementType: ExpenseMovementSummary["type"] =
        movimiento.type === "debt" ? "debt" : "expense";

      return {
        id: movimiento.id,
        label: description || categoryLabel,
        categoryLabel: movementType === "debt" ? "Deuda" : categoryLabel,
        amount: movimiento.amount,
        percentage: (movimiento.amount / totalExpenses) * 100,
        date: movimiento.date,
        type: movementType,
      };
    })
    .sort((first, second) => second.amount - first.amount);
};

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
