import { X } from "lucide-react";
import type { MouseEvent } from "react";
import { createPortal } from "react-dom";
import type { FormMovimientoValues } from "../../types/formMovimiento";
import { MovimientoFormFields } from "./MovimientoFormFields";

type MovimientoModalProps = {
  isEditing: boolean;
  formKey: string;
  formInitialValues: FormMovimientoValues;
  onBackdropClick: (event: MouseEvent<HTMLDivElement>) => void;
  onClose: () => void;
  onSubmitValues: (values: FormMovimientoValues) => void;
};

export const MovimientoModal = ({
  isEditing,
  formKey,
  formInitialValues,
  onBackdropClick,
  onClose,
  onSubmitValues,
}: MovimientoModalProps) =>
  createPortal(
    <section
      className="fixed inset-0 z-[100] bg-slate-950/45 backdrop-blur-sm"
      onClick={onBackdropClick}
    >
      <div className="grid min-h-full place-items-center px-4 py-6">
        <div className="w-full max-w-md overflow-hidden rounded-[2rem] border border-slate-700 bg-slate-900 shadow-[0_36px_120px_-40px_rgba(0,0,0,0.7)]">
          <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 px-5 py-5 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-100">
                  Movimientos
                </p>
                <h3 className="mt-2 text-2xl font-bold">
                  {isEditing ? "Editar movimiento" : "Agregar movimiento"}
                </h3>
                <p className="mt-2 max-w-sm text-sm text-blue-50/90">
                  Registra ingresos, gastos, ahorro o abonos sin salir de esta
                  vista.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar formulario"
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-white transition hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white/30"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="max-h-[70vh] overflow-y-auto bg-slate-950 px-4 py-4 sm:px-5 sm:py-5">
            <div className="rounded-[24px] border border-slate-700 bg-slate-900 p-4 sm:p-5">
              <MovimientoFormFields
                key={formKey}
                initialValues={formInitialValues}
                isEditing={isEditing}
                onSubmitValues={onSubmitValues}
                onCancel={onClose}
              />
            </div>
          </div>
        </div>
      </div>
    </section>,
    document.body
  );
