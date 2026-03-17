import type { ReactNode } from "react";
import { useFinanzas } from "../context/FinanzasContext";
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
  const { summary } = useFinanzas();

  const balanceCards = [
    {
      title: "Ingresos",
      amount: formatCurrency(summary.ingresos),
      bgClass: "from-green-400 to-green-500",
      iconBgClass: "bg-green-300/30",
      icon: "wallet" as const,
    },
    {
      title: "Balance Actual",
      amount: formatCurrency(summary.balance),
      bgClass: "from-blue-400 to-blue-600",
      iconBgClass: "bg-blue-300/30",
      icon: "balance" as const,
    },
    {
      title: "Gastos",
      amount: formatCurrency(summary.gastos),
      bgClass: "from-red-400 to-red-500",
      iconBgClass: "bg-red-300/30",
      icon: "cart" as const,
    },
  ];

  return (
    <section className="grid grid-cols-3 gap-3 sm:gap-4">
      {balanceCards.map((card) => (
        <article
          key={card.title}
          className={`rounded-xl bg-gradient-to-br ${card.bgClass} px-3 py-3 text-white shadow-md transition-transform duration-200 hover:-translate-y-0.5 sm:px-5 sm:py-4`}
        >
          <div className="flex flex-col items-center text-center">
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
        </article>
      ))}
    </section>
  );
};
