import type { ReactNode } from "react";
import { BasketIcon, CarIcon, GameIcon, WalletIcon } from "./icons";

export const iconMap: Record<string, ReactNode> = {
  wallet: <WalletIcon />,
  basket: <BasketIcon />,
  car: <CarIcon />,
  game: <GameIcon />,
};
