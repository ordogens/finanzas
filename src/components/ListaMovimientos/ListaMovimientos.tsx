import { useFinanzas } from "../../context/useFinanzas";
import { EmptyMovementsState } from "./EmptyMovementsState";
import { MovimientoListItem } from "./MovimientoListItem";

export const ListaMovimientos = () => {
  const { movimientos, startEditing, deleteMovimiento } = useFinanzas();

  return (
    <section className="py-5">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
            Actividad
          </p>
          <h3 className="text-xl font-bold text-slate-100">Movimientos Recientes</h3>
        </div>
        <div className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-400">
          {movimientos.length} registros
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-slate-700 bg-slate-800 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.5)] ring-1 ring-slate-700">
        {movimientos.length === 0 ? (
          <EmptyMovementsState />
        ) : (
          <div className="max-h-[28rem] overflow-y-auto px-2 py-2 sm:max-h-[32rem]">
            {movimientos.map((movimiento, index) => (
              <MovimientoListItem
                key={movimiento.id}
                movimiento={movimiento}
                isLast={index === movimientos.length - 1}
                onEdit={startEditing}
                onDelete={deleteMovimiento}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
