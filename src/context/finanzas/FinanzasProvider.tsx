import { useState } from "react";
import type { FormMovimientoValues } from "../../types/formMovimiento";
import type { MovimientoItem } from "../../types/movimiento";
import { FinanzasContext } from "../finanzasStore";
import { useAuth } from "../useAuth";
import type { FinanzasContextValue } from "../useFinanzas";
import {
  calculateAhorroSummary,
  calculateDeudaSummary,
  calculateSummary,
  formatDate,
  normalizeMonto,
} from "./calculations";
import {
  readStoredAhorroMeta,
  readStoredDeudaMeta,
  readStoredMovimientos,
} from "./storage";
import { useFinanzasPersistence } from "./useFinanzasPersistence";
import type {
  FinanzasProviderContentProps,
  FinanzasProviderProps,
} from "./types";

export const FinanzasProvider = ({ children }: FinanzasProviderProps) => {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  return (
    <FinanzasProviderContent key={userId ?? "guest"} userId={userId}>
      {children}
    </FinanzasProviderContent>
  );
};

const FinanzasProviderContent = ({
  children,
  userId,
}: FinanzasProviderContentProps) => {
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

  useFinanzasPersistence({
    userId,
    movimientos,
    ahorroMeta,
    deudaMeta,
  });

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
