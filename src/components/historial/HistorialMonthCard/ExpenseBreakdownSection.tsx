import { currencyFormatter, type ExpenseMovementSummary } from "../historial.utils";
import { chartBarPalette } from "./constants";
import { EmptyMonthState } from "./EmptyMonthState";

type ExpenseBreakdownSectionProps = {
  items: ExpenseMovementSummary[];
  totalOutflows: number;
};

export const ExpenseBreakdownSection = ({
  items,
  totalOutflows,
}: ExpenseBreakdownSectionProps) => (
  <div className="rounded-2xl bg-slate-800 p-4 ring-1 ring-slate-700">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Detalle de salidas
        </p>
        <h3 className="mt-1 text-base font-semibold text-slate-100">
          Cada gasto y abono a deuda del mes
        </h3>
      </div>
      <span className="rounded-full bg-rose-950/50 px-3 py-1 text-xs font-semibold text-rose-400">
        {currencyFormatter.format(totalOutflows)}
      </span>
    </div>

    {items.length === 0 ? (
      <div className="mt-4">
        <EmptyMonthState message="Este mes no tiene gastos ni abonos a deuda registrados, as&iacute; que todav&iacute;a no hay gr&aacute;fico detallado." />
      </div>
    ) : (
      <div className="mt-4 space-y-3">
        {items.map((item, index) => (
          <div key={item.id} className="space-y-2">
            <div className="flex items-center justify-between gap-3 text-sm">
              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-200">
                  {item.label}
                </p>
                <p className="text-xs text-slate-400">
                  {item.categoryLabel} - {item.date} - {item.percentage.toFixed(0)}%
                  de las salidas del mes
                </p>
              </div>
              <p className="shrink-0 font-semibold text-slate-200">
                {currencyFormatter.format(item.amount)}
              </p>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-700">
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
);
