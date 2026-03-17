import {
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { movimientosIniciales } from "../data/movimientos";
import type { FormMovimientoValues } from "../types/formMovimiento";
import type { AhorroSummary, MovimientoItem, MovimientoSummary } from "../types/movimiento";
import { FinanzasContext } from "./finanzasStore";
import type { FinanzasContextValue } from "./useFinanzas";

const STORAGE_KEY = "finanzas-movimientos";
const AHORRO_META_KEY = "finanzas-ahorro-meta";

const normalizeMonto = (monto: string) => Number(monto.trim());

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);

const calculateSummary = (movimientos: MovimientoItem[]): MovimientoSummary => {
  const ingresos = movimientos
    .filter((movimiento) => movimiento.type === "income")
    .reduce((total, movimiento) => total + movimiento.amount, 0);

  const gastos = movimientos
    .filter((movimiento) => movimiento.type === "expense")
    .reduce((total, movimiento) => total + movimiento.amount, 0);

  return {
    ingresos,
    gastos,
    balance: ingresos - gastos,
  };
};

const calculateAhorroSummary = (
  movimientos: MovimientoItem[],
  meta: number
): AhorroSummary => {
  const ahorrado = movimientos
    .filter((movimiento) => movimiento.category === "ahorro")
    .reduce((total, movimiento) => total + movimiento.amount, 0);
  const sanitizedMeta = Math.max(meta, 0);
  const restante = Math.max(sanitizedMeta - ahorrado, 0);
  const progreso =
    sanitizedMeta > 0 ? Math.min((ahorrado / sanitizedMeta) * 100, 100) : 0;

  return {
    ahorrado,
    meta: sanitizedMeta,
    restante,
    progreso,
  };
};

const readStoredMovimientos = (): MovimientoItem[] => {
  if (typeof window === "undefined") {
    return movimientosIniciales;
  }

  const rawValue = window.localStorage.getItem(STORAGE_KEY);

  if (!rawValue) {
    return movimientosIniciales;
  }

  try {
    const parsedValue = JSON.parse(rawValue) as MovimientoItem[];

    if (!Array.isArray(parsedValue)) {
      return movimientosIniciales;
    }

    return parsedValue;
  } catch {
    return movimientosIniciales;
  }
};

const readStoredAhorroMeta = (): number => {
  if (typeof window === "undefined") {
    return 0;
  }

  const rawValue = window.localStorage.getItem(AHORRO_META_KEY);

  if (!rawValue) {
    return 0;
  }

  const parsedValue = Number(rawValue);

  return Number.isFinite(parsedValue) && parsedValue >= 0 ? parsedValue : 0;
};

type FinanzasProviderProps = {
  children: ReactNode;
};

export const FinanzasProvider = ({ children }: FinanzasProviderProps) => {
  const [movimientos, setMovimientos] =
    useState<MovimientoItem[]>(readStoredMovimientos);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [ahorroMeta, setAhorroMeta] = useState<number>(readStoredAhorroMeta);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(movimientos));
  }, [movimientos]);

  useEffect(() => {
    window.localStorage.setItem(AHORRO_META_KEY, String(ahorroMeta));
  }, [ahorroMeta]);

  const addMovimiento = (values: FormMovimientoValues) => {
    const nextMovimiento: MovimientoItem = {
      id: Date.now(),
      category: values.categoria,
      description: values.descripcion.trim(),
      amount: normalizeMonto(values.monto),
      date: formatDate(new Date()),
      type: values.tipo,
    };

    setMovimientos((currentMovimientos) => [nextMovimiento, ...currentMovimientos]);
  };

  const updateMovimiento = (id: number, values: FormMovimientoValues) => {
    setMovimientos((currentMovimientos) =>
      currentMovimientos.map((movimiento) =>
        movimiento.id === id
          ? {
              ...movimiento,
              category: values.categoria,
              description: values.descripcion.trim(),
              amount: normalizeMonto(values.monto),
              type: values.tipo,
            }
          : movimiento
      )
    );

    setEditingId(null);
  };

  const deleteMovimiento = (id: number) => {
    setMovimientos((currentMovimientos) =>
      currentMovimientos.filter((movimiento) => movimiento.id !== id)
    );

    setEditingId((currentEditingId) =>
      currentEditingId === id ? null : currentEditingId
    );
  };

  const startEditing = (id: number) => {
    setEditingId(id);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const updateAhorroMeta = (value: number) => {
    setAhorroMeta(Math.max(value, 0));
  };

  const editingMovimiento =
    movimientos.find((movimiento) => movimiento.id === editingId) ?? null;

  const value: FinanzasContextValue = {
    movimientos,
    editingMovimiento,
    summary: calculateSummary(movimientos),
    ahorro: calculateAhorroSummary(movimientos, ahorroMeta),
    addMovimiento,
    updateMovimiento,
    deleteMovimiento,
    startEditing,
    cancelEditing,
    updateAhorroMeta,
  };

  return (
    <FinanzasContext.Provider value={value}>{children}</FinanzasContext.Provider>
  );
};
