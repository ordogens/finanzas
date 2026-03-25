import { iconMap } from "./iconMap";
import type { SummaryCard } from "./types";

type SummaryCardsProps = {
  cards: SummaryCard[];
};

export const SummaryCards = ({ cards }: SummaryCardsProps) => (
  <div className="grid grid-cols-2 gap-3 sm:gap-4">
    {cards.map((card) => (
      <article
        key={card.title}
        className={
          card.title === "Balance Actual"
            ? `overflow-hidden rounded-[22px] border border-blue-100/45 bg-gradient-to-br from-[#2848f0] via-[#2339de] to-[#1f2cc2] ${card.layoutClass} px-4 py-4 text-white shadow-[0_22px_48px_-26px_rgba(35,57,222,0.72)] transition-transform duration-200 hover:-translate-y-0.5 sm:px-6 sm:py-5`
            : `rounded-xl bg-gradient-to-br ${card.bgClass} ${card.borderClass ?? ""} ${card.shadowClass ?? "shadow-md"} ${card.layoutClass} px-3 py-3 text-white transition-transform duration-200 hover:-translate-y-0.5 sm:px-5 sm:py-4`
        }
      >
        {card.title === "Balance Actual" ? (
          <div className="flex h-full flex-col justify-center">
            <div className="flex items-center gap-4 text-white/80">
              <div className="h-px flex-1 bg-white/20" />
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl ${card.iconBgClass} text-white shadow-inner ring-1 ring-white/10`}
              >
                {iconMap[card.icon]}
              </div>
              <div className="h-px flex-1 bg-white/20" />
            </div>

            <h3 className="mt-3 text-center text-lg font-bold text-white sm:text-[1.45rem]">
              Balance Total
            </h3>

            <p className="mt-3 text-center text-[1.9rem] font-bold leading-none tracking-tight text-white sm:text-[2.4rem]">
              {card.amount}
            </p>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div
              className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${card.iconBgClass} shadow-inner sm:h-12 sm:w-12`}
            >
              {iconMap[card.icon]}
            </div>

            <h3 className="text-sm font-semibold sm:text-base">{card.title}</h3>

            <div className="my-3 h-px w-full bg-white/20" />

            <p className="text-lg font-bold leading-none tracking-tight sm:text-[1.5rem]">
              {card.amount}
            </p>
          </div>
        )}
      </article>
    ))}
  </div>
);
