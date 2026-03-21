import { useMemo, useState } from "react";
import { HistorialMonthCard } from "../components/historial/HistorialMonthCard";
import {
  buildMonthGroups,
  getMonthKey,
} from "../components/historial/historial.utils";
import { useFinanzas } from "../context/useFinanzas";

export const Historial = () => {
  const { movimientos } = useFinanzas();
  const currentMonthKey = getMonthKey(new Date());
  const monthGroups = useMemo(() => buildMonthGroups(movimientos), [movimientos]);

  const [openMonth, setOpenMonth] = useState<string | null>(currentMonthKey);
  const visibleOpenMonth =
    openMonth === null
      ? null
      : monthGroups.some((group) => group.key === openMonth)
      ? openMonth
      : monthGroups[0]?.key ?? currentMonthKey;

  return (
    <section className="space-y-5">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
          Resumen mensual
        </p>
        <h1 className="text-2xl font-bold text-slate-800">Historial</h1>
        <p className="text-sm text-slate-500">
          Cada mes se agrega autom&aacute;ticamente y el actual queda visible para
          seguir tu balance al d&iacute;a.
        </p>
      </div>
      <div className="space-y-3">
        {monthGroups.map((group) => {
          return (
            <HistorialMonthCard
              key={group.key}
              group={group}
              isCurrentMonth={group.key === currentMonthKey}
              isOpen={visibleOpenMonth === group.key}
              onToggle={() =>
                setOpenMonth((currentOpenMonth) =>
                  currentOpenMonth === group.key ? null : group.key
                )
              }
            />
          );
        })}
      </div>
    </section>
  );
};
