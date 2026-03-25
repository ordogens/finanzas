import type { ReactNode } from "react";
import type { BalanceCardIcon } from "../../types/cardBalance";
import { CardIcon, CartIcon, WalletIcon } from "./icons";

export const iconMap: Record<BalanceCardIcon, ReactNode> = {
  wallet: <WalletIcon />,
  balance: <CardIcon />,
  cart: <CartIcon />,
};
