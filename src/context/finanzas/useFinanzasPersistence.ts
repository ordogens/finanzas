import { useEffect } from "react";
import type { MovimientoItem } from "../../types/movimiento";
import {
  getAhorroMetaStorageKey,
  getDeudaMetaStorageKey,
  getMovimientosStorageKey,
} from "./storage";

type UseFinanzasPersistenceParams = {
  userId: string | null;
  movimientos: MovimientoItem[];
  ahorroMeta: number;
  deudaMeta: number;
};

export const useFinanzasPersistence = ({
  userId,
  movimientos,
  ahorroMeta,
  deudaMeta,
}: UseFinanzasPersistenceParams) => {
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
};
