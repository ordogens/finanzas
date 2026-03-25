import { useState, type FormEvent } from "react";
import { useFinanzas } from "../../context/useFinanzas";
import { formatCurrency } from "./formatters";
import { GoalsSection } from "./GoalsSection";
import { SummaryCards } from "./SummaryCards";
import type { GoalCard, SummaryCard } from "./types";

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

    const nextGoal = Number(type === "ahorro" ? ahorroMetaInput : deudaMetaInput);

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

  const balanceCards: SummaryCard[] = [
    {
      title: "Balance Actual",
      amount: formatCurrency(summary.balance),
      bgClass: "from-blue-400 to-blue-600",
      iconBgClass: "bg-blue-300/30",
      icon: "balance",
      layoutClass: "col-span-2 min-h-[148px] sm:min-h-[164px]",
    },
    {
      title: "Ingresos",
      amount: formatCurrency(summary.ingresos),
      bgClass: "from-emerald-400 via-teal-400 to-cyan-500",
      iconBgClass: "bg-white/22",
      borderClass: "border border-emerald-100/40",
      shadowClass: "shadow-[0_22px_48px_-24px_rgba(16,185,129,0.78)]",
      icon: "wallet",
      layoutClass: "min-h-[148px]",
    },
    {
      title: "Gastos",
      amount: formatCurrency(summary.gastos),
      bgClass: "from-rose-600 via-pink-700 to-[#8f123f]",
      iconBgClass: "bg-white/18",
      borderClass: "border border-rose-100/28",
      shadowClass: "shadow-[0_22px_48px_-24px_rgba(190,24,93,0.76)]",
      icon: "cart",
      layoutClass: "min-h-[148px]",
    },
  ];

  const goalCards: GoalCard[] = [
    {
      key: "ahorro",
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
      key: "deuda",
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
      <SummaryCards cards={balanceCards} />
      <GoalsSection
        ahorroRestante={ahorro.restante}
        deudaRestante={deuda.restante}
        isOpen={isGoalsOpen}
        onToggle={() => setIsGoalsOpen((currentState) => !currentState)}
        cards={goalCards}
      />
    </section>
  );
};
