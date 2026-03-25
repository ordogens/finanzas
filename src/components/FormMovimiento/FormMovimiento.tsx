import { Plus } from "lucide-react";
import { useState, type MouseEvent } from "react";
import { useFinanzas } from "../../context/useFinanzas";
import { MovimientoModal } from "./MovimientoModal";
import { useFormMovimientoEffects } from "./useFormMovimientoEffects";
import { getFormInitialValues } from "./utils";

export const FormMovimiento = () => {
  const { addMovimiento, updateMovimiento, editingMovimiento, cancelEditing } =
    useFinanzas();
  const [isExpanded, setIsExpanded] = useState(false);
  const isEditing = editingMovimiento !== null;
  const formKey = editingMovimiento ? `edit-${editingMovimiento.id}` : "new";
  const formInitialValues = getFormInitialValues(editingMovimiento);
  const isOpen = isExpanded || isEditing;

  useFormMovimientoEffects(isOpen);

  const handleClose = () => {
    if (isEditing) {
      cancelEditing();
    }

    setIsExpanded(false);
  };

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

  return (
    <>
      <section className="sticky top-[41.5rem] z-20 -mt-7 mb-[-1.125rem] flex justify-end pr-3 sm:fixed sm:bottom-6 sm:right-6 sm:top-auto sm:mt-0 sm:mb-0 sm:pr-0">
        {!isOpen ? (
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            aria-label="Agregar movimiento"
            className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500 text-white shadow-[0_18px_35px_-14px_rgba(37,99,235,0.75)] transition hover:-translate-y-1 hover:from-blue-600 hover:via-blue-700 hover:to-cyan-600 focus:outline-none focus:ring-4 focus:ring-blue-200"
          >
            <Plus className="h-8 w-8" strokeWidth={2.8} />
          </button>
        ) : null}
      </section>

      {isOpen ? (
        <MovimientoModal
          isEditing={isEditing}
          formKey={formKey}
          formInitialValues={formInitialValues}
          onBackdropClick={handleBackdropClick}
          onClose={handleClose}
          onSubmitValues={(values) => {
            if (editingMovimiento) {
              updateMovimiento(editingMovimiento.id, values);
              return;
            }

            addMovimiento(values);
            setIsExpanded(false);
          }}
        />
      ) : null}
    </>
  );
};
