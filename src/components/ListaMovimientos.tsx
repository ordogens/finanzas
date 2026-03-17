import type { ReactNode } from "react";
import { categoriasLabels } from "../data/formMovimiento";
import { useFinanzas } from "../context/FinanzasContext";

const WalletIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6 text-green-700" fill="none">
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
  </svg>
);

const BasketIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6 text-amber-500" fill="none">
    <path
      d="M5 9h14l-1.2 8.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8L5 9Z"
      fill="currentColor"
      opacity="0.95"
    />
    <path
      d="M9 9 12 5l3 4M4 9h16"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CarIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6 text-blue-600" fill="none">
    <path
      d="M6.5 8.5 8 6h8l1.5 2.5M5.5 10h13a1 1 0 0 1 1 1v4.5a1 1 0 0 1-1 1h-1v1a1 1 0 0 1-2 0v-1h-7v1a1 1 0 0 1-2 0v-1h-1a1 1 0 0 1-1-1V11a1 1 0 0 1 1-1Z"
      fill="currentColor"
      opacity="0.95"
    />
    <circle cx="8" cy="15" r="1.2" fill="#fff" />
    <circle cx="16" cy="15" r="1.2" fill="#fff" />
  </svg>
);

const GameIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6 text-rose-500" fill="none">
    <path
      d="M7.5 8h9a4 4 0 0 1 3.9 4.8l-.7 3.2a2 2 0 0 1-3.3 1l-2.2-2a3 3 0 0 0-4.1 0l-2.2 2a2 2 0 0 1-3.3-1l-.7-3.2A4 4 0 0 1 7.5 8Z"
      fill="currentColor"
      opacity="0.95"
    />
    <path
      d="M9 12h2m-1-1v2m5-1h.01M17 12h.01"
      stroke="#fff"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const iconMap: Record<string, ReactNode> = {
  wallet: <WalletIcon />,
  basket: <BasketIcon />,
  car: <CarIcon />,
  game: <GameIcon />,
};

const categoryIconMap: Record<string, keyof typeof iconMap> = {
  salario: "wallet",
  freelance: "wallet",
  ventas: "wallet",
  "otros-ingresos": "wallet",
  supermercado: "basket",
  transporte: "car",
  entretenimiento: "game",
  servicios: "basket",
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);

export const ListaMovimientos = () => {
  const { movimientos, startEditing, deleteMovimiento } = useFinanzas();

  return (
    <section className="border-y border-slate-200 py-5">
      <h3 className="mb-4 text-xl font-bold text-slate-700">
        Movimientos Recientes
      </h3>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {movimientos.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-slate-500 sm:px-5">
            Aún no hay movimientos registrados.
          </div>
        ) : null}

        {movimientos.map((movimiento, index) => {
          const amountColor =
            movimiento.type === "income" ? "text-green-700" : "text-slate-700";
          const sign = movimiento.type === "income" ? "+" : "-";
          const iconKey = categoryIconMap[movimiento.category] ?? "basket";
          const label =
            categoriasLabels[movimiento.category as keyof typeof categoriasLabels] ??
            movimiento.category;
          const secondaryText = movimiento.description.trim() || label;

          return (
            <article
              key={movimiento.id}
              className={`flex flex-col gap-3 px-4 py-3 sm:px-5 lg:flex-row lg:items-center ${
                index !== movimientos.length - 1 ? "border-b border-slate-200" : ""
              }`}
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50">
                  {iconMap[iconKey]}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-slate-600 sm:text-base">
                    <span className={`font-bold ${amountColor}`}>{sign} </span>
                    <span className={`font-bold ${amountColor}`}>
                      {formatCurrency(movimiento.amount)}
                    </span>{" "}
                    {secondaryText}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 lg:ml-auto">
                <p className="text-sm text-slate-400 sm:text-base">{movimiento.date}</p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => startEditing(movimiento.id)}
                    className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteMovimiento(movimiento.id)}
                    className="rounded-lg border border-red-200 px-2 py-1 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
