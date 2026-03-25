import { useState } from "react";
import { buildExpenseMovementSummary } from "../historial.utils";
import { ExpenseBreakdownSection } from "./ExpenseBreakdownSection";
import { MonthCardHeader } from "./MonthCardHeader";
import { MonthSummarySection } from "./MonthSummarySection";
import { MovementsSection } from "./MovementsSection";
import type { HistorialMonthCardProps } from "./types";

export const HistorialMonthCard = ({
  group,
  isCurrentMonth,
  isOpen,
  onToggle,
}: HistorialMonthCardProps) => {
  const [isMovementsOpen, setIsMovementsOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const expenseSummary = buildExpenseMovementSummary(group.movimientos);
  const totalOutflows = group.summary.gastos + group.deuda;

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-800">
      <MonthCardHeader
        label={group.label}
        balance={group.summary.balance}
        isCurrentMonth={isCurrentMonth}
        isOpen={isOpen}
        onToggle={onToggle}
      />

      {isOpen ? (
        <div className="border-t border-slate-700 bg-slate-900/60 px-4 py-4 sm:px-5">
          <ExpenseBreakdownSection
            items={expenseSummary}
            totalOutflows={totalOutflows}
          />

          <MonthSummarySection
            group={group}
            isOpen={isSummaryOpen}
            onToggle={() => setIsSummaryOpen((currentState) => !currentState)}
          />

          <MovementsSection
            movimientos={group.movimientos}
            isOpen={isMovementsOpen}
            onToggle={() => setIsMovementsOpen((currentState) => !currentState)}
          />
        </div>
      ) : null}
    </article>
  );
};
