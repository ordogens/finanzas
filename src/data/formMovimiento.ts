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
    { value: "arriendo", label: "Arriendo" },
    { value: "deudas", label: "Deudas" },
    { value: "entretenimiento", label: "Entretenimiento" },
    { value: "servicios", label: "Servicios" },
  ],
  saving: [{ value: "ahorro", label: "Ahorro" }],
};

export const categoriasLabels = {
  salario: "Salario",
  freelance: "Freelance",
  ahorro: "Ahorro",
  ventas: "Ventas",
  "otros-ingresos": "Otros ingresos",
  supermercado: "Supermercado",
  moto: "Moto",
  arriendo: "Arriendo",
  deudas: "Deudas",
  entretenimiento: "Entretenimiento",
  servicios: "Servicios",
  Rappi: "Rappi",
} as const;
