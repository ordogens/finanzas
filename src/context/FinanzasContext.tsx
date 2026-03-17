import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { movimientosIniciales } from "../data/movimientos";
import type { FormMovimientoValues } from "../types/formMovimiento";
import type { MovimientoItem, MovimientoSummary } from "../types/movimiento";

type FinanzasContextValue = {
  movimientos: MovimientoItem[];
  editingMovimiento: MovimientoItem | null;
  summary: MovimientoSummary;
  addMovimiento: (values: FormMovimientoValues) => void;
  updateMovimiento: (id: number, values: FormMovimientoValues) => void;
  deleteMovimiento: (id: number) => void;
  startEditing: (id: number) => void;
  cancelEditing: () => void;
};

const STORAGE_KEY = "finanzas-movimientos";

const FinanzasContext = createContext<FinanzasContextValue | undefined>(
  undefined
);

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

type FinanzasProviderProps = {
  children: ReactNode;
};

export const FinanzasProvider = ({ children }: FinanzasProviderProps) => {
  const [movimientos, setMovimientos] =
    useState<MovimientoItem[]>(readStoredMovimientos);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(movimientos));
  }, [movimientos]);

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

  const editingMovimiento =
    movimientos.find((movimiento) => movimiento.id === editingId) ?? null;

  const value: FinanzasContextValue = {
    movimientos,
    editingMovimiento,
    summary: calculateSummary(movimientos),
    addMovimiento,
    updateMovimiento,
    deleteMovimiento,
    startEditing,
    cancelEditing,
  };

  return (
    <FinanzasContext.Provider value={value}>{children}</FinanzasContext.Provider>
  );
};

export const useFinanzas = () => {
  const context = useContext(FinanzasContext);

  if (!context) {
    throw new Error("useFinanzas debe usarse dentro de FinanzasProvider");
  }

  return context;
};
