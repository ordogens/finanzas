type SummaryCardProps = {
  title: string;
  value: string;
  className: string;
  valueClassName: string;
};

export const SummaryCard = ({
  title,
  value,
  className,
  valueClassName,
}: SummaryCardProps) => (
  <div className={className}>
    <p className="text-xs font-semibold uppercase tracking-[0.18em]">{title}</p>
    <p className={`mt-2 text-lg font-bold ${valueClassName}`}>{value}</p>
  </div>
);
