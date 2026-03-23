export type MovimientoTipo = "income" | "expense" | "saving" | "debt";

export type MovimientoItem = {
  id: number;
  category: string;
  description: string;
  amount: number;
  date: string;
  type: MovimientoTipo;
};

export type MovimientoSummary = {
  ingresos: number;
  gastos: number;
  balance: number;
};

export type AhorroSummary = {
  ahorrado: number;
  meta: number;
  restante: number;
  progreso: number;
};

export type DeudaSummary = {
  abonado: number;
  meta: number;
  restante: number;
  progreso: number;
};
