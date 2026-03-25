import type { MovimientoItem } from "../../types/movimiento";
import { formatCurrency } from "./formatters";
import { iconMap } from "./iconMap";
import {
  getAmountColor,
  getAmountSign,
  getCategoryLabel,
  getMovementIconKey,
  getMovementTypeLabel,
  getSecondaryText,
} from "./utils";

type MovimientoListItemProps = {
  movimiento: MovimientoItem;
  isLast: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

export const MovimientoListItem = ({
  movimiento,
  isLast,
  onEdit,
  onDelete,
}: MovimientoListItemProps) => {
  const amountColor = getAmountColor(movimiento.type);
  const sign = getAmountSign(movimiento.type);
  const iconKey = getMovementIconKey(movimiento.category);
  const label = getCategoryLabel(movimiento.category);
  const secondaryText = getSecondaryText(movimiento, label);
  const movementTypeLabel = getMovementTypeLabel(movimiento, label);

  return (
    <article
      className={`mb-2 flex flex-col gap-3 rounded-2xl border border-transparent bg-slate-800/60 px-4 py-4 transition hover:border-slate-600 hover:bg-slate-700/60 sm:px-5 lg:flex-row lg:items-center ${
        isLast ? "mb-0" : ""
      }`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-700 ring-1 ring-slate-600">
          {iconMap[iconKey]}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-200 sm:text-base">
            <span className={amountColor}>{sign} </span>
            <span className={amountColor}>{formatCurrency(movimiento.amount)}</span>{" "}
            {secondaryText}
          </p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
            {movementTypeLabel}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 lg:ml-auto lg:min-w-[16rem]">
        <p className="rounded-full bg-slate-700 px-3 py-1 text-xs font-semibold text-slate-400 ring-1 ring-slate-600">
          {movimiento.date}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(movimiento.id)}
            className="rounded-full border border-slate-600 bg-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-slate-500 hover:bg-slate-600"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={() => onDelete(movimiento.id)}
            className="rounded-full border border-rose-800 bg-slate-700 px-3 py-1.5 text-xs font-semibold text-rose-400 transition hover:border-rose-700 hover:bg-rose-950/40"
          >
            Eliminar
          </button>
        </div>
      </div>
    </article>
  );
};
