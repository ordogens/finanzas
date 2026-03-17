import { createContext } from "react";
import type { FinanzasContextValue } from "./useFinanzas";

export const FinanzasContext = createContext<FinanzasContextValue | undefined>(
  undefined
);
