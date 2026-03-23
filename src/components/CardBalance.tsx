import { ChevronDown } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import { useFinanzas } from "../context/useFinanzas";
import type { BalanceCardIcon } from "../types/cardBalance";

const WalletIcon = () => (
  <svg viewBox="0 0 24 24" className="h-8 w-8 text-white/90" fill="none">
    <path
      d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18a2 2 0 0 1 2 2v1H7A3 3 0 0 0 4 11v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20 9.5h-8A1.5 1.5 0 0 0 10.5 11v2A1.5 1.5 0 0 0 12 14.5h8V9.5Z"
      fill="currentColor"
    />
    <circle cx="13.5" cy="12" r="1" fill="#4CAF50" />
  </svg>
);

const CardIcon = () => (
  <svg viewBox="0 0 24 24" className="h-8 w-8 text-white/90" fill="none">
    <path
      d="M3.5 8.5A2.5 2.5 0 0 1 6 6h12A2.5 2.5 0 0 1 20.5 8.5v7A2.5 2.5 0 0 1 18 18H6a2.5 2.5 0 0 1-2.5-2.5v-7Z"
      fill="currentColor"
      opacity="0.95"
    />
    <path
      d="M6.5 9.25h11M6.5 12.5h4"
      stroke="#3B82F6"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
    <path
      d="M5.5 5h8"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      opacity="0.85"
    />
  </svg>
);

const CartIcon = () => (
  <svg viewBox="0 0 24 24" className="h-8 w-8 text-white/90" fill="none">
    <path
      d="M4 5h2l1.4 7.2a1 1 0 0 0 1 .8h7.9a1 1 0 0 0 1-.75L19 8H7"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="10" cy="18" r="1.4" fill="currentColor" />
    <circle cx="17" cy="18" r="1.4" fill="currentColor" />
    <path
      d="M9 8V5m3 3V5m3 3V5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

const iconMap: Record<BalanceCardIcon, ReactNode> = {
  wallet: <WalletIcon />,
  balance: <CardIcon />,
  cart: <CartIcon />,
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);

export const CardBalance = () => {
  const { summary, ahorro, deuda, updateAhorroMeta, updateDeudaMeta } =
    useFinanzas();
  const [ahorroMetaInput, setAhorroMetaInput] = useState("");
  const [deudaMetaInput, setDeudaMetaInput] = useState("");
  const [isEditingAhorroGoal, setIsEditingAhorroGoal] = useState(ahorro.meta === 0);
  const [isEditingDeudaGoal, setIsEditingDeudaGoal] = useState(deuda.meta === 0);
  const [isGoalsOpen, setIsGoalsOpen] = useState(false);

  const handleSubmitGoal = (
    event: FormEvent<HTMLFormElement>,
    type: "ahorro" | "deuda"
  ) => {
    event.preventDefault();

    const nextGoal = Number(
      type === "ahorro" ? ahorroMetaInput : deudaMetaInput
    );

    if (!Number.isFinite(nextGoal) || nextGoal < 0) {
      return;
    }

    if (type === "ahorro") {
      updateAhorroMeta(nextGoal);
      setIsEditingAhorroGoal(false);
      return;
    }

    updateDeudaMeta(nextGoal);
    setIsEditingDeudaGoal(false);
  };

  const balanceCards = [
    {
      title: "Balance Actual",
      amount: formatCurrency(summary.balance),
      bgClass: "from-blue-400 to-blue-600",
      iconBgClass: "bg-blue-300/30",
      icon: "balance" as const,
      layoutClass: "col-span-2 min-h-[148px] sm:min-h-[164px]",
    },
    {
      title: "Ingresos",
      amount: formatCurrency(summary.ingresos),
      bgClass: "from-green-400 to-green-500",
      iconBgClass: "bg-green-300/30",
      icon: "wallet" as const,
      layoutClass: "min-h-[148px]",
    },
    {
      title: "Gastos",
      amount: formatCurrency(summary.gastos),
      bgClass: "from-red-400 to-red-500",
      iconBgClass: "bg-red-300/30",
      icon: "cart" as const,
      layoutClass: "min-h-[148px]",
    },
  ];

  const goalCards = [
    {
      key: "ahorro" as const,
      badge: "Meta prioritaria",
      title: "Objetivo de ahorro",
      description:
        "El progreso se calcula con los movimientos registrados en la categoria de ahorro.",
      progressLabel: "Avance",
      currentAmount: ahorro.ahorrado,
      goalAmount: ahorro.meta,
      progress: ahorro.progreso,
      restante: ahorro.restante,
      restanteLabel: "Restante",
      message: `Te faltan ${formatCurrency(
        ahorro.restante
      )} para alcanzar tu objetivo de ahorro.`,
      inputId: "ahorro-meta",
      inputLabel: "Meta de ahorro",
      inputPlaceholder: "Ej: 15000000",
      inputValue: ahorroMetaInput,
      setInputValue: setAhorroMetaInput,
      isEditing: isEditingAhorroGoal,
      onEdit: () => {
        setAhorroMetaInput(ahorro.meta > 0 ? String(ahorro.meta) : "");
        setIsEditingAhorroGoal(true);
      },
      onSubmit: (event: FormEvent<HTMLFormElement>) =>
        handleSubmitGoal(event, "ahorro"),
      cardClass:
        "bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 shadow-[0_18px_40px_-24px_rgba(37,99,235,0.8)]",
      progressClass: "bg-gradient-to-r from-lime-300 via-emerald-300 to-cyan-200",
      focusClass: "focus:border-cyan-300 focus:ring-cyan-100",
      buttonClass:
        "rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20",
      panelClass: "bg-white/12",
    },
    {
      key: "deuda" as const,
      badge: "Plan de libertad",
      title: "Pago de deudas",
      description:
        "Cada abono registrado reduce lo que te falta para salir de esa deuda.",
      progressLabel: "Pagado",
      currentAmount: deuda.abonado,
      goalAmount: deuda.meta,
      progress: deuda.progreso,
      restante: deuda.restante,
      restanteLabel: "Te falta pagar",
      message: `Te falta pagar ${formatCurrency(
        deuda.restante
      )} para que seas libre.`,
      inputId: "deuda-meta",
      inputLabel: "Valor total de la deuda",
      inputPlaceholder: "Ej: 8000000",
      inputValue: deudaMetaInput,
      setInputValue: setDeudaMetaInput,
      isEditing: isEditingDeudaGoal,
      onEdit: () => {
        setDeudaMetaInput(deuda.meta > 0 ? String(deuda.meta) : "");
        setIsEditingDeudaGoal(true);
      },
      onSubmit: (event: FormEvent<HTMLFormElement>) =>
        handleSubmitGoal(event, "deuda"),
      cardClass:
        "bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 shadow-[0_18px_40px_-24px_rgba(249,115,22,0.9)]",
      progressClass: "bg-gradient-to-r from-yellow-200 via-amber-200 to-white",
      focusClass: "focus:border-amber-300 focus:ring-amber-100",
      buttonClass:
        "rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20",
      panelClass: "bg-white/12",
    },
  ];

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {balanceCards.map((card) => (
          <article
            key={card.title}
            className={
              card.title === "Balance Actual"
                ? `overflow-hidden rounded-[22px] border border-blue-200 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 ${card.layoutClass} px-4 py-4 text-white shadow-[0_18px_40px_-28px_rgba(37,99,235,0.7)] transition-transform duration-200 hover:-translate-y-0.5 sm:px-6 sm:py-5`
                : `rounded-xl bg-gradient-to-br ${card.bgClass} ${card.layoutClass} px-3 py-3 text-white shadow-md transition-transform duration-200 hover:-translate-y-0.5 sm:px-5 sm:py-4`
            }
          >
            {card.title === "Balance Actual" ? (
              <div className="flex h-full flex-col justify-center">
                <div className="flex items-center gap-4 text-blue-100">
                  <div className="h-px flex-1 bg-white/30" />
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl ${card.iconBgClass} text-white shadow-inner ring-1 ring-white/15`}
                  >
                    {iconMap[card.icon]}
                  </div>
                  <div className="h-px flex-1 bg-white/30" />
                </div>

                <h3 className="mt-3 text-center text-lg font-bold text-white sm:text-[1.45rem]">
                  Balance Total
                </h3>

                <p className="mt-3 text-center text-[1.9rem] font-bold leading-none tracking-tight text-white sm:text-[2.4rem]">
                  {card.amount}
                </p>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div
                  className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${card.iconBgClass} shadow-inner sm:h-12 sm:w-12`}
                >
                  {iconMap[card.icon]}
                </div>

                <h3 className="text-sm font-semibold sm:text-base">{card.title}</h3>

                <div className="my-3 h-px w-full bg-white/30" />

                <p className="text-lg font-bold leading-none tracking-tight sm:text-[1.5rem]">
                  {card.amount}
                </p>
              </div>
            )}
          </article>
        ))}
      </div>

      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <button
          type="button"
          onClick={() => setIsGoalsOpen((currentState) => !currentState)}
          aria-expanded={isGoalsOpen}
          className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition hover:bg-slate-50 sm:px-5"
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
              Objetivos
            </p>
            <h3 className="mt-1 text-xl font-bold text-slate-800">
              Ahorro y pago de deuda
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {formatCurrency(ahorro.restante)} pendientes en ahorro y{" "}
              {formatCurrency(deuda.restante)} por pagar.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 sm:block">
              {isGoalsOpen ? "Ocultar" : "Ver detalles"}
            </div>
            <ChevronDown
              className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${
                isGoalsOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>

        {isGoalsOpen ? (
          <div className="border-t border-slate-200 bg-slate-50/70 p-4 sm:p-5">
            <div className="grid gap-4 lg:grid-cols-2">
              {goalCards.map((card) => (
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

                  <div className={`mt-4 rounded-2xl p-4 backdrop-blur-sm ${card.panelClass}`}>
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
                            onChange={(event) =>
                              card.setInputValue(event.target.value)
                            }
                            className={`w-full rounded-xl border border-white/15 bg-white px-4 py-2.5 text-slate-700 outline-none transition placeholder:text-slate-400 focus:ring-2 ${card.focusClass}`}
                          />
                          <button
                            type="submit"
                            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-950"
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
    </section>
  );
};
