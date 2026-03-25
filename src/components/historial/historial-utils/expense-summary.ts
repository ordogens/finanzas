import type { MovimientoItem } from "../../../types/movimiento";
import { getCategoryLabel } from "./display";
import type { ExpenseCategorySummary, ExpenseMovementSummary } from "./types";

const getExpenseMovimientos = (movimientos: MovimientoItem[]) =>
  movimientos.filter(
    (movimiento) => movimiento.type === "expense" || movimiento.type === "debt"
  );

export const buildExpenseCategorySummary = (
  movimientos: MovimientoItem[]
): ExpenseCategorySummary[] => {
  const expenseMovimientos = getExpenseMovimientos(movimientos);
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
  const expenseMovimientos = getExpenseMovimientos(movimientos);
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
