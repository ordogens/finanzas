import { movimientosIniciales } from "../../data/movimientos";
import type { MovimientoItem } from "../../types/movimiento";

export const getMovimientosStorageKey = (userId: string | null) =>
  `finanzas-movimientos-${userId ?? "guest"}`;

export const getAhorroMetaStorageKey = (userId: string | null) =>
  `finanzas-ahorro-meta-${userId ?? "guest"}`;

export const getDeudaMetaStorageKey = (userId: string | null) =>
  `finanzas-deuda-meta-${userId ?? "guest"}`;

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

export const readStoredMovimientos = (userId: string | null): MovimientoItem[] => {
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

const readStoredNonNegativeNumber = (storageKey: string): number => {
  if (typeof window === "undefined") {
    return 0;
  }

  const rawValue = window.localStorage.getItem(storageKey);

  if (!rawValue) {
    return 0;
  }

  const parsedValue = Number(rawValue);

  return Number.isFinite(parsedValue) && parsedValue >= 0 ? parsedValue : 0;
};

export const readStoredAhorroMeta = (userId: string | null): number =>
  readStoredNonNegativeNumber(getAhorroMetaStorageKey(userId));

export const readStoredDeudaMeta = (userId: string | null): number =>
  readStoredNonNegativeNumber(getDeudaMetaStorageKey(userId));
