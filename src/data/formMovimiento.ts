import type { CategoriasPorTipo } from "../types/formMovimiento";

export const categoriasPorTipo: CategoriasPorTipo = {
  income: [
    { value: "salario", label: "Salario" },
    { value: "freelance", label: "Freelance" },
    { value: "Rappi", label: "Rappi" },
    { value: "ventas", label: "Ventas" },
    { value: "otros-ingresos", label: "Otros ingresos" },
  ],
  expense: [
    { value: "supermercado", label: "Supermercado" },
    { value: "moto", label: "Moto" },
    { value: "entretenimiento", label: "Entretenimiento" },
    { value: "servicios", label: "Servicios" },
  ],
};

export const categoriasLabels = {
  salario: "Salario",
  freelance: "Freelance",
  ventas: "Ventas",
  "otros-ingresos": "Otros ingresos",
  supermercado: "Supermercado",
  moto: "Moto",
  entretenimiento: "Entretenimiento",
  servicios: "Servicios",
} as const;
