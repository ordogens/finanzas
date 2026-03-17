export type BalanceCardIcon = "wallet" | "balance" | "cart";

export type BalanceCardItem = {
  title: string;
  amount: string;
  bgClass: string;
  iconBgClass: string;
  icon: BalanceCardIcon;
};
