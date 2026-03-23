import { useEffect, useState, type ReactNode } from "react";
import { movimientosIniciales } from "../data/movimientos";
import type { FormMovimientoValues } from "../types/formMovimiento";
import type {
  AhorroSummary,
  DeudaSummary,
  MovimientoItem,
  MovimientoSummary,
} from "../types/movimiento";
import { FinanzasContext } from "./finanzasStore";
import { useAuth } from "./useAuth";
import type { FinanzasContextValue } from "./useFinanzas";

const getMovimientosStorageKey = (userId: string | null) =>
  `finanzas-movimientos-${userId ?? "guest"}`;

const getAhorroMetaStorageKey = (userId: string | null) =>
  `finanzas-ahorro-meta-${userId ?? "guest"}`;

const getDeudaMetaStorageKey = (userId: string | null) =>
  `finanzas-deuda-meta-${userId ?? "guest"}`;

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

  const ahorroApartado = movimientos
    .filter((movimiento) => movimiento.type === "saving")
    .reduce((total, movimiento) => total + movimiento.amount, 0);

  const deudaApartada = movimientos
    .filter((movimiento) => movimiento.type === "debt")
    .reduce((total, movimiento) => total + movimiento.amount, 0);

  return {
    ingresos,
    gastos,
    balance: ingresos - gastos - ahorroApartado - deudaApartada,
  };
};

const calculateAhorroSummary = (
  movimientos: MovimientoItem[],
  meta: number
): AhorroSummary => {
  const ahorrado = movimientos
    .filter(
      (movimiento) =>
        movimiento.category === "ahorro" || movimiento.type === "saving"
    )
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

const calculateDeudaSummary = (
  movimientos: MovimientoItem[],
  meta: number
): DeudaSummary => {
  const abonado = movimientos
    .filter(
      (movimiento) =>
        movimiento.category === "abono-deuda" || movimiento.type === "debt"
    )
    .reduce((total, movimiento) => total + movimiento.amount, 0);
  const sanitizedMeta = Math.max(meta, 0);
  const restante = Math.max(sanitizedMeta - abonado, 0);
  const progreso =
    sanitizedMeta > 0 ? Math.min((abonado / sanitizedMeta) * 100, 100) : 0;

  return {
    abonado,
    meta: sanitizedMeta,
    restante,
    progreso,
  };
};

const normalizeStoredMovimientos = (
  storedMovimientos: MovimientoItem[]
): MovimientoItem[] =>
  storedMovimientos.map((movimiento): MovimientoItem =>
    movimiento.category === "ahorro" && movimiento.type === "income"
      ? {
          ...movimiento,
          type: "saving",
        }
      : movimiento
  );

const readStoredMovimientos = (userId: string | null): MovimientoItem[] => {
  if (typeof window === "undefined") {
    return movimientosIniciales;
  }

  const rawValue = window.localStorage.getItem(getMovimientosStorageKey(userId));

  if (!rawValue) {
    return movimientosIniciales;
  }

  try {
    const parsedValue = JSON.parse(rawValue) as MovimientoItem[];

    if (!Array.isArray(parsedValue)) {
      return movimientosIniciales;
    }

    return normalizeStoredMovimientos(parsedValue);
  } catch {
    return movimientosIniciales;
  }
};

const readStoredAhorroMeta = (userId: string | null): number => {
  if (typeof window === "undefined") {
    return 0;
  }

  const rawValue = window.localStorage.getItem(getAhorroMetaStorageKey(userId));

  if (!rawValue) {
    return 0;
  }

  const parsedValue = Number(rawValue);

  return Number.isFinite(parsedValue) && parsedValue >= 0 ? parsedValue : 0;
};

const readStoredDeudaMeta = (userId: string | null): number => {
  if (typeof window === "undefined") {
    return 0;
  }

  const rawValue = window.localStorage.getItem(getDeudaMetaStorageKey(userId));

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
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [movimientos, setMovimientos] = useState<MovimientoItem[]>(() =>
    readStoredMovimientos(userId)
  );
  const [editingId, setEditingId] = useState<number | null>(null);
  const [ahorroMeta, setAhorroMeta] = useState<number>(() =>
    readStoredAhorroMeta(userId)
  );
  const [deudaMeta, setDeudaMeta] = useState<number>(() =>
    readStoredDeudaMeta(userId)
  );

  useEffect(() => {
    setMovimientos(readStoredMovimientos(userId));
    setAhorroMeta(readStoredAhorroMeta(userId));
    setDeudaMeta(readStoredDeudaMeta(userId));
    setEditingId(null);
  }, [userId]);

  useEffect(() => {
    window.localStorage.setItem(
      getMovimientosStorageKey(userId),
      JSON.stringify(movimientos)
    );
  }, [movimientos, userId]);

  useEffect(() => {
    window.localStorage.setItem(
      getAhorroMetaStorageKey(userId),
      String(ahorroMeta)
    );
  }, [ahorroMeta, userId]);

  useEffect(() => {
    window.localStorage.setItem(
      getDeudaMetaStorageKey(userId),
      String(deudaMeta)
    );
  }, [deudaMeta, userId]);

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

  const updateDeudaMeta = (value: number) => {
    setDeudaMeta(Math.max(value, 0));
  };

  const editingMovimiento =
    movimientos.find((movimiento) => movimiento.id === editingId) ?? null;

  const value: FinanzasContextValue = {
    movimientos,
    editingMovimiento,
    summary: calculateSummary(movimientos),
    ahorro: calculateAhorroSummary(movimientos, ahorroMeta),
    deuda: calculateDeudaSummary(movimientos, deudaMeta),
    addMovimiento,
    updateMovimiento,
    deleteMovimiento,
    startEditing,
    cancelEditing,
    updateAhorroMeta,
    updateDeudaMeta,
  };

  return (
    <FinanzasContext.Provider value={value}>{children}</FinanzasContext.Provider>
  );
};
