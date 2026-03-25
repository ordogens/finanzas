import { ChevronDown } from "lucide-react";
import { formatCurrency } from "./formatters";
import type { GoalCard } from "./types";

type GoalsSectionProps = {
  ahorroRestante: number;
  deudaRestante: number;
  isOpen: boolean;
  onToggle: () => void;
  cards: GoalCard[];
};

export const GoalsSection = ({
  ahorroRestante,
  deudaRestante,
  isOpen,
  onToggle,
  cards,
}: GoalsSectionProps) => (
  <div className="overflow-hidden rounded-[28px] border border-slate-800 bg-slate-950/90 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.9)] ring-1 ring-white/5 backdrop-blur-sm">
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition hover:bg-slate-900 sm:px-5"
    >
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
          Objetivos
        </p>
        <h3 className="mt-1 text-xl font-bold text-slate-100">
          Ahorro y pago de deuda
        </h3>
        <p className="mt-1 text-sm text-slate-400">
          {formatCurrency(ahorroRestante)} pendientes en ahorro y{" "}
          {formatCurrency(deudaRestante)} por pagar.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-semibold text-slate-400 sm:block">
          {isOpen ? "Ocultar" : "Ver detalles"}
        </div>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-slate-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>
    </button>

    {isOpen ? (
      <div className="border-t border-slate-800 bg-slate-950/70 p-4 sm:p-5">
        <div className="grid gap-4 lg:grid-cols-2">
          {cards.map((card) => (
            <article
              key={card.key}
              className={`overflow-hidden rounded-[26px] p-5 text-white ${card.cardClass}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/75">
                    {card.badge}
                  </p>
                  <h3 className="mt-2 text-2xl font-bold">{card.title}</h3>
                  <p className="mt-2 max-w-xs text-sm text-white/80">
                    {card.description}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/15 px-4 py-3 text-right backdrop-blur-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                    {card.progressLabel}
                  </p>
                  <p className="mt-2 text-2xl font-bold">
                    {Math.round(card.progress)}%
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-end justify-between gap-3">
                <p className="text-3xl font-bold tracking-tight">
                  {formatCurrency(card.currentAmount)}
                </p>
                <p className="pb-1 text-sm font-semibold text-white/80">
                  de {formatCurrency(card.goalAmount)}
                </p>
              </div>

              <div className="mt-4 h-4 overflow-hidden rounded-full bg-white/20">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${card.progressClass}`}
                  style={{ width: `${card.progress}%` }}
                />
              </div>

              <div
                className={`mt-4 rounded-2xl p-4 backdrop-blur-sm ${card.panelClass}`}
              >
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                    {card.restanteLabel}
                  </p>
                  <p className="text-lg font-semibold text-white">
                    {formatCurrency(card.restante)}
                  </p>
                  <p className="text-sm text-white/80">{card.message}</p>
                </div>

                {card.isEditing ? (
                  <form
                    onSubmit={card.onSubmit}
                    className="mt-4 flex w-full flex-col gap-2"
                  >
                    <label
                      htmlFor={card.inputId}
                      className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70"
                    >
                      {card.inputLabel}
                    </label>
                    <div className="flex gap-2">
                      <input
                        id={card.inputId}
                        type="number"
                        min="0"
                        inputMode="numeric"
                        placeholder={card.inputPlaceholder}
                        value={card.inputValue}
                        onChange={(event) => card.setInputValue(event.target.value)}
                        className={`w-full rounded-xl border border-white/15 bg-slate-950/65 px-4 py-2.5 text-white outline-none transition placeholder:text-slate-400 focus:ring-2 ${card.focusClass}`}
                      />
                      <button
                        type="submit"
                        className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-black"
                      >
                        Guardar
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    type="button"
                    onClick={card.onEdit}
                    className={`mt-4 ${card.buttonClass}`}
                  >
                    Editar meta
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    ) : null}
  </div>
);
