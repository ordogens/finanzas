import type { MovimientoItem } from "../types/movimiento";

export const movimientosIniciales: MovimientoItem[] = [
  {
    id: 1,
    category: "salario",
    description: "",
    amount: 2500000,
    date: "02/05/2024",
    type: "income",
  },
  {
    id: 2,
    category: "supermercado",
    description: "",
    amount: 150000,
    date: "01/05/2024",
    type: "expense",
  },
  {
    id: 3,
    category: "transporte",
    description: "",
    amount: 80000,
    date: "30/04/2024",
    type: "expense",
  },
  {
    id: 4,
    category: "entretenimiento",
    description: "",
    amount: 120000,
    date: "29/04/2024",
    type: "expense",
  },
];
