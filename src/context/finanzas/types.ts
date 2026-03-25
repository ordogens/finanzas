import type { ReactNode } from "react";

export type FinanzasProviderProps = {
  children: ReactNode;
};

export type FinanzasProviderContentProps = {
  children: ReactNode;
  userId: string | null;
};
