import type { ReactNode } from "react";
import { categoriasLabels } from "../data/formMovimiento";
import { useFinanzas } from "../context/useFinanzas";

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
  ahorro: "wallet",
  "abono-deuda": "wallet",
  ventas: "wallet",
  "otros-ingresos": "wallet",
  supermercado: "basket",
  moto: "car",
  entretenimiento: "game",
  servicios: "basket",
  arriendo: "basket",
  deudas: "basket",
  Rappi: "wallet",
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
    <section className="py-5">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
            Actividad
          </p>
          <h3 className="text-xl font-bold text-slate-800">Movimientos Recientes</h3>
        </div>
        <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-500 shadow-sm">
          {movimientos.length} registros
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/95 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.35)] ring-1 ring-slate-100">
        {movimientos.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-slate-500">
            Aún no hay movimientos registrados.
          </div>
        ) : (
          <div className="max-h-[28rem] overflow-y-auto px-2 py-2 sm:max-h-[32rem]">
            {movimientos.map((movimiento, index) => {
              const amountColor =
                movimiento.type === "income"
                  ? "text-green-700"
                  : movimiento.type === "saving"
                    ? "text-cyan-700"
                    : movimiento.type === "debt"
                      ? "text-amber-700"
                    : "text-rose-700";
              const sign = movimiento.type === "income" ? "+" : "-";
              const iconKey = categoryIconMap[movimiento.category] ?? "basket";
              const label =
                categoriasLabels[movimiento.category as keyof typeof categoriasLabels] ??
                movimiento.category;
              const secondaryText =
                movimiento.description.trim() ||
                (movimiento.type === "saving"
                  ? "Transferencia a ahorro"
                  : movimiento.type === "debt"
                    ? "Abono a deuda"
                  : label);

              return (
                <article
                  key={movimiento.id}
                  className={`mb-2 flex flex-col gap-3 rounded-2xl border border-transparent bg-slate-50/80 px-4 py-4 transition hover:border-slate-200 hover:bg-white hover:shadow-sm sm:px-5 lg:flex-row lg:items-center ${
                    index === movimientos.length - 1 ? "mb-0" : ""
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
                      {iconMap[iconKey]}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-700 sm:text-base">
                        <span className={amountColor}>{sign} </span>
                        <span className={amountColor}>
                          {formatCurrency(movimiento.amount)}
                        </span>{" "}
                        {secondaryText}
                      </p>
                      <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                        {movimiento.type === "saving"
                          ? "Ahorro"
                          : movimiento.type === "debt"
                            ? "Deuda"
                            : label}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 lg:ml-auto lg:min-w-[16rem]">
                    <p className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
                      {movimiento.date}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => startEditing(movimiento.id)}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-100"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteMovimiento(movimiento.id)}
                        className="rounded-full border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:border-red-300 hover:bg-red-50"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
