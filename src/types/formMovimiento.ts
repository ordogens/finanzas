import type { MovimientoTipo } from "./movimiento";

export type CategoriaOption = {
  value: string;
  label: string;
};

export type CategoriasPorTipo = Record<MovimientoTipo, CategoriaOption[]>;

export type FormMovimientoValues = {
  tipo: MovimientoTipo;
  monto: string;
  categoria: string;
  descripcion: string;
};
