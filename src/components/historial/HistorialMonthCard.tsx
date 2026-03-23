import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { MonthGroup } from "./historial.utils";
import {
  buildExpenseMovementSummary,
  currencyFormatter,
  getBalanceTone,
  getCategoryLabel,
} from "./historial.utils";

type HistorialMonthCardProps = {
  group: MonthGroup;
  isCurrentMonth: boolean;
  isOpen: boolean;
  onToggle: () => void;
};

const SummaryCard = ({
  title,
  value,
  className,
  valueClassName,
}: {
  title: string;
  value: string;
  className: string;
  valueClassName: string;
}) => (
  <div className={className}>
    <p className="text-xs font-semibold uppercase tracking-[0.18em]">{title}</p>
    <p className={`mt-2 text-lg font-bold ${valueClassName}`}>{value}</p>
  </div>
);

const EmptyMonthState = () => (
  <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-5 text-sm text-slate-500">
    A&uacute;n no hay movimientos en este mes.
  </div>
);

const chartBarPalette = [
  "from-rose-500 to-red-400",
  "from-orange-500 to-amber-400",
  "from-sky-500 to-cyan-400",
  "from-violet-500 to-fuchsia-400",
  "from-emerald-500 to-teal-400",
  "from-slate-500 to-slate-400",
];

export const HistorialMonthCard = ({
  group,
  isCurrentMonth,
  isOpen,
  onToggle,
}: HistorialMonthCardProps) => {
  const [isMovementsOpen, setIsMovementsOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const balanceTone = getBalanceTone(group.summary.balance);
  const expenseSummary = buildExpenseMovementSummary(group.movimientos);
  const totalOutflows = group.summary.gastos + group.deuda;

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition hover:bg-slate-50 sm:px-5"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-slate-800">{group.label}</h2>
            {isCurrentMonth ? (
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-600">
                Actual
              </span>
            ) : null}
          </div>
          <p className={`mt-1 text-sm font-medium ${balanceTone}`}>
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
        <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-4 sm:px-5">
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Detalle de salidas
                </p>
                <h3 className="mt-1 text-base font-semibold text-slate-800">
                  Cada gasto y abono a deuda del mes
                </h3>
              </div>
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
                {currencyFormatter.format(totalOutflows)}
              </span>
            </div>

            {expenseSummary.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">
                Este mes no tiene gastos ni abonos a deuda registrados, as&iacute;
                que todav&iacute;a no hay gr&aacute;fico detallado.
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {expenseSummary.map((item, index) => (
                  <div key={item.id} className="space-y-2">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-700">
                          {item.label}
                        </p>
                        <p className="text-xs text-slate-400">
                          {item.categoryLabel} - {item.date} -{" "}
                          {item.percentage.toFixed(0)}% de las salidas del mes
                        </p>
                      </div>
                      <p className="shrink-0 font-semibold text-slate-700">
                        {currencyFormatter.format(item.amount)}
                      </p>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${
                          chartBarPalette[index % chartBarPalette.length]
                        }`}
                        style={{
                          width: `${Math.max(item.percentage, 6)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
            <button
              type="button"
              onClick={() => setIsSummaryOpen((currentState) => !currentState)}
              className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition hover:bg-slate-50"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Resumen del mes
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-700">
                  Balance: {currencyFormatter.format(group.summary.balance)}
                </p>
              </div>

              <ChevronDown
                className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${
                  isSummaryOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isSummaryOpen ? (
              <div className="border-t border-slate-100 bg-slate-50/60 px-4 py-4">
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                  <SummaryCard
                    title="Ingresos"
                    value={currencyFormatter.format(group.summary.ingresos)}
                    className="rounded-2xl bg-emerald-50 px-4 py-3 text-emerald-700"
                    valueClassName="text-emerald-700"
                  />
                  <SummaryCard
                    title="Gastos"
                    value={currencyFormatter.format(group.summary.gastos)}
                    className="rounded-2xl bg-rose-50 px-4 py-3 text-rose-700"
                    valueClassName="text-rose-700"
                  />
                  <SummaryCard
                    title="Ahorro"
                    value={currencyFormatter.format(group.ahorro)}
                    className="rounded-2xl bg-cyan-50 px-4 py-3 text-cyan-700"
                    valueClassName="text-cyan-700"
                  />
                  <SummaryCard
                    title="Deuda"
                    value={currencyFormatter.format(group.deuda)}
                    className="rounded-2xl bg-amber-50 px-4 py-3 text-amber-700"
                    valueClassName="text-amber-700"
                  />
                  <SummaryCard
                    title="Balance"
                    value={currencyFormatter.format(group.summary.balance)}
                    className="rounded-2xl bg-slate-900 px-4 py-3 text-white"
                    valueClassName="text-white"
                  />
                </div>
              </div>
            ) : null}
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
            <button
              type="button"
              onClick={() => setIsMovementsOpen((currentState) => !currentState)}
              className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition hover:bg-slate-50"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Historial de movimientos
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-700">
                  {group.movimientos.length} movimiento
                  {group.movimientos.length === 1 ? "" : "s"}
                </p>
              </div>

              <ChevronDown
                className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${
                  isMovementsOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isMovementsOpen ? (
              <div className="border-t border-slate-100 bg-slate-50/60 px-4 py-4">
                <div className="space-y-2">
                  {group.movimientos.length === 0 ? (
                    <EmptyMonthState />
                  ) : (
                    group.movimientos.map((movimiento) => {
                      const categoryLabel = getCategoryLabel(movimiento.category);
                      const amountTone =
                        movimiento.type === "income"
                          ? "text-emerald-600"
                          : movimiento.type === "saving"
                            ? "text-cyan-700"
                            : movimiento.type === "debt"
                              ? "text-amber-700"
                              : "text-rose-700";
                      const sign = movimiento.type === "income" ? "+" : "-";

                      return (
                        <div
                          key={movimiento.id}
                          className="flex flex-col gap-2 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-100 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div>
                            <p className="font-semibold text-slate-800">
                              {movimiento.description.trim() || categoryLabel}
                            </p>
                            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                              {movimiento.type === "saving"
                                ? "Ahorro"
                                : movimiento.type === "debt"
                                  ? "Deuda"
                                  : categoryLabel}
                            </p>
                          </div>

                          <div className="flex items-center justify-between gap-3 sm:justify-end">
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                              {movimiento.date}
                            </span>
                            <span className={`text-sm font-bold ${amountTone}`}>
                              {sign} {currencyFormatter.format(movimiento.amount)}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </article>
  );
};
