import type { BalanceCardItem } from "../types/cardBalance";

export const balanceCards: BalanceCardItem[] = [
  {
    title: "Ingresos",
    amount: "$3,200,000",
    bgClass: "from-green-400 to-green-500",
    iconBgClass: "bg-green-300/30",
    icon: "wallet",
  },
  {
    title: "Balance Actual",
    amount: "$2,150,000",
    bgClass: "from-blue-400 to-blue-600",
    iconBgClass: "bg-blue-300/30",
    icon: "balance",
  },
  {
    title: "Gastos",
    amount: "$1,050,000",
    bgClass: "from-red-400 to-red-500",
    iconBgClass: "bg-red-300/30",
    icon: "cart",
  },
];
