import type { Dispatch, FormEvent, SetStateAction } from "react";
import type { BalanceCardIcon } from "../../types/cardBalance";

export type SummaryCard = {
  title: string;
  amount: string;
  bgClass: string;
  iconBgClass: string;
  icon: BalanceCardIcon;
  layoutClass: string;
  borderClass?: string;
  shadowClass?: string;
};

export type GoalCard = {
  key: "ahorro" | "deuda";
  badge: string;
  title: string;
  description: string;
  progressLabel: string;
  currentAmount: number;
  goalAmount: number;
  progress: number;
  restante: number;
  restanteLabel: string;
  message: string;
  inputId: string;
  inputLabel: string;
  inputPlaceholder: string;
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
  isEditing: boolean;
  onEdit: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  cardClass: string;
  progressClass: string;
  focusClass: string;
  buttonClass: string;
  panelClass: string;
};
