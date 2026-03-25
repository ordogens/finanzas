import { categoriasLabels } from "../../../data/formMovimiento";

export const getBalanceTone = (balance: number) => {
  if (balance > 0) {
    return "text-emerald-400";
  }

  if (balance < 0) {
    return "text-rose-400";
  }

  return "text-slate-500";
};

export const getCategoryLabel = (category: string) =>
  categoriasLabels[category as keyof typeof categoriasLabels] ?? category;
