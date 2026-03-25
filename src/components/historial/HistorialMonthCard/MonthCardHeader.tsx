import { ChevronDown } from "lucide-react";
import { currencyFormatter, getBalanceTone } from "../historial.utils";

type MonthCardHeaderProps = {
  label: string;
  balance: number;
  isCurrentMonth: boolean;
  isOpen: boolean;
  onToggle: () => void;
};

export const MonthCardHeader = ({
  label,
  balance,
  isCurrentMonth,
  isOpen,
  onToggle,
}: MonthCardHeaderProps) => {
  const balanceTone = getBalanceTone(balance);

  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition hover:bg-slate-700 sm:px-5"
    >
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-slate-100">{label}</h2>
          {isCurrentMonth ? (
            <span className="rounded-full bg-blue-950/60 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-400">
              Actual
            </span>
          ) : null}
        </div>
        <p className={`mt-1 text-sm font-medium ${balanceTone}`}>
          Balance: {currencyFormatter.format(balance)}
        </p>
      </div>

      <ChevronDown
        className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${
          isOpen ? "rotate-180" : ""
        }`}
      />
    </button>
  );
};
