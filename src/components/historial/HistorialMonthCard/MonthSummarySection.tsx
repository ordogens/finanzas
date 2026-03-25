import { ChevronDown } from "lucide-react";
import type { MonthGroup } from "../historial.utils";
import { currencyFormatter } from "../historial.utils";
import { SummaryCard } from "./SummaryCard";

type MonthSummarySectionProps = {
  group: MonthGroup;
  isOpen: boolean;
  onToggle: () => void;
};

export const MonthSummarySection = ({
  group,
  isOpen,
  onToggle,
}: MonthSummarySectionProps) => (
  <div className="mt-4 overflow-hidden rounded-2xl bg-slate-800 ring-1 ring-slate-700">
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition hover:bg-slate-700"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Resumen del mes
        </p>
        <p className="mt-1 text-sm font-semibold text-slate-200">
          Balance: {currencyFormatter.format(group.summary.balance)}
        </p>
      </div>

      <ChevronDown
        className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${
          isOpen ? "rotate-180" : ""
        }`}
      />
    </button>

    {isOpen ? (
      <div className="border-t border-slate-700 bg-slate-900/50 px-4 py-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <SummaryCard
            title="Ingresos"
            value={currencyFormatter.format(group.summary.ingresos)}
            className="rounded-2xl bg-emerald-950/50 px-4 py-3 text-emerald-400"
            valueClassName="text-emerald-400"
          />
          <SummaryCard
            title="Gastos"
            value={currencyFormatter.format(group.summary.gastos)}
            className="rounded-2xl bg-rose-950/50 px-4 py-3 text-rose-400"
            valueClassName="text-rose-400"
          />
          <SummaryCard
            title="Ahorro"
            value={currencyFormatter.format(group.ahorro)}
            className="rounded-2xl bg-cyan-950/50 px-4 py-3 text-cyan-400"
            valueClassName="text-cyan-400"
          />
          <SummaryCard
            title="Deuda"
            value={currencyFormatter.format(group.deuda)}
            className="rounded-2xl bg-amber-950/50 px-4 py-3 text-amber-400"
            valueClassName="text-amber-400"
          />
          <SummaryCard
            title="Balance"
            value={currencyFormatter.format(group.summary.balance)}
            className="rounded-2xl bg-slate-950 px-4 py-3 text-white"
            valueClassName="text-white"
          />
        </div>
      </div>
    ) : null}
  </div>
);
