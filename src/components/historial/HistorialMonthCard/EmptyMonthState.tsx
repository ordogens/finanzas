type EmptyMonthStateProps = {
  message?: string;
};

export const EmptyMonthState = ({ message }: EmptyMonthStateProps) => (
  <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-800/50 px-4 py-5 text-sm text-slate-500">
    {message ?? "A&uacute;n no hay movimientos en este mes."}
  </div>
);
