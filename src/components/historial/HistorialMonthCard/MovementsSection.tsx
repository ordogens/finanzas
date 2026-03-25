import { ChevronDown } from "lucide-react";
import type { MovimientoItem } from "../../../types/movimiento";
import { currencyFormatter, getCategoryLabel } from "../historial.utils";
import { EmptyMonthState } from "./EmptyMonthState";

type MovementsSectionProps = {
  movimientos: MovimientoItem[];
  isOpen: boolean;
  onToggle: () => void;
};

export const MovementsSection = ({
  movimientos,
  isOpen,
  onToggle,
}: MovementsSectionProps) => (
  <div className="mt-4 overflow-hidden rounded-2xl bg-slate-800 ring-1 ring-slate-700">
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition hover:bg-slate-700"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Historial de movimientos
        </p>
        <p className="mt-1 text-sm font-semibold text-slate-200">
          {movimientos.length} movimiento{movimientos.length === 1 ? "" : "s"}
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
        <div className="space-y-2">
          {movimientos.length === 0 ? (
            <EmptyMonthState />
          ) : (
            movimientos.map((movimiento) => {
              const categoryLabel = getCategoryLabel(movimiento.category);
              const amountTone =
                movimiento.type === "income"
                  ? "text-emerald-400"
                  : movimiento.type === "saving"
                    ? "text-cyan-400"
                    : movimiento.type === "debt"
                      ? "text-amber-400"
                      : "text-rose-400";
              const sign = movimiento.type === "income" ? "+" : "-";

              return (
                <div
                  key={movimiento.id}
                  className="flex flex-col gap-2 rounded-2xl bg-slate-700/60 px-4 py-3 ring-1 ring-slate-600 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-slate-100">
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
                    <span className="rounded-full bg-slate-700 px-3 py-1 text-xs font-semibold text-slate-400">
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
);
