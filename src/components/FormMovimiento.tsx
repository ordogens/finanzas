import { Plus, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useFinanzas } from "../context/useFinanzas";
import { categoriasPorTipo } from "../data/formMovimiento";
import type { FormMovimientoValues } from "../types/formMovimiento";
import type { MovimientoTipo } from "../types/movimiento";

const initialValues: FormMovimientoValues = {
  tipo: "income",
  monto: "",
  categoria: "",
  descripcion: "",
};

const labelsByType: Record<MovimientoTipo, string> = {
  income: "Ingreso",
  expense: "Gasto",
  saving: "Ahorro",
  debt: "Abono a deuda",
};

export const FormMovimiento = () => {
  const { addMovimiento, updateMovimiento, editingMovimiento, cancelEditing } =
    useFinanzas();
  const [isExpanded, setIsExpanded] = useState(false);
  const isEditing = editingMovimiento !== null;
  const formKey = editingMovimiento ? `edit-${editingMovimiento.id}` : "new";
  const formInitialValues = editingMovimiento
    ? {
        tipo: editingMovimiento.type,
        monto: String(editingMovimiento.amount),
        categoria: editingMovimiento.category,
        descripcion: editingMovimiento.description,
      }
    : initialValues;

  const isOpen = isExpanded || isEditing;

  return (
    <>
      {isOpen ? (
        <div className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-[2px]" />
      ) : null}

      <section className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
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
        <section className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 sm:left-auto sm:right-6 sm:w-full sm:max-w-[32rem] sm:px-0 sm:pb-6">
          <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_30px_80px_-30px_rgba(15,23,42,0.45)]">
            <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 px-5 py-5 text-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-100">
                    Movimientos
                  </p>
                  <h3 className="mt-2 text-2xl font-bold">
                    {isEditing ? "Editar movimiento" : "Agregar movimiento"}
                  </h3>
                  <p className="mt-2 max-w-md text-sm text-blue-50/90">
                    Registra ingresos, gastos, ahorro o abonos de deuda sin salir
                    de la vista principal.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (isEditing) {
                      cancelEditing();
                    }

                    setIsExpanded(false);
                  }}
                  aria-label="Cerrar formulario"
                  className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-white transition hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white/30"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="max-h-[75vh] overflow-y-auto bg-slate-50 px-4 py-4 sm:px-5 sm:py-5">
              <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <MovimientoFormFields
                  key={formKey}
                  initialValues={formInitialValues}
                  isEditing={isEditing}
                  onSubmitValues={(values) => {
                    if (editingMovimiento) {
                      updateMovimiento(editingMovimiento.id, values);
                      return;
                    }

                    addMovimiento(values);
                    setIsExpanded(false);
                  }}
                  onCancel={() => {
                    cancelEditing();
                    setIsExpanded(false);
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
};

type MovimientoFormFieldsProps = {
  initialValues: FormMovimientoValues;
  isEditing: boolean;
  onSubmitValues: (values: FormMovimientoValues) => void;
  onCancel: () => void;
};

const MovimientoFormFields = ({
  initialValues,
  isEditing,
  onSubmitValues,
  onCancel,
}: MovimientoFormFieldsProps) => {
  const [values, setValues] = useState<FormMovimientoValues>(initialValues);
  const [submitted, setSubmitted] = useState(false);

  const categoryOptions = categoriasPorTipo[values.tipo];
  const isFormValid =
    values.monto.trim() !== "" &&
    Number(values.monto) > 0 &&
    values.categoria !== "";

  const handleTypeChange = (tipo: MovimientoTipo) => {
    setValues((currentValues) => ({
      ...currentValues,
      tipo,
      categoria:
        tipo === "saving" ? "ahorro" : tipo === "debt" ? "abono-deuda" : "",
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);

    if (!isFormValid) {
      return;
    }

    onSubmitValues(values);
    setSubmitted(false);

    if (!isEditing) {
      setValues(initialValues);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label
          htmlFor="tipo"
          className="block text-sm font-semibold text-slate-700"
        >
          Tipo
        </label>
        <select
          id="tipo"
          value={values.tipo}
          onChange={(event) =>
            handleTypeChange(event.target.value as MovimientoTipo)
          }
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        >
          <option value="income">Ingreso</option>
          <option value="expense">Gasto</option>
          <option value="saving">Ahorro</option>
          <option value="debt">Abono deuda</option>
        </select>
        <div className="grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() =>
              setValues((currentValues) => ({
                ...currentValues,
                tipo: "saving",
                categoria: "ahorro",
              }))
            }
            className="w-full rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-left text-sm font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-100"
          >
            Registrar aporte a ahorro
          </button>
          <button
            type="button"
            onClick={() =>
              setValues((currentValues) => ({
                ...currentValues,
                tipo: "debt",
                categoria: "abono-deuda",
              }))
            }
            className="w-full rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-left text-sm font-semibold text-amber-700 transition hover:border-amber-300 hover:bg-amber-100"
          >
            Registrar abono a deuda
          </button>
        </div>
        <p className="text-xs text-slate-500">
          Ahorro y deuda apartan dinero de tu disponible sin contarlo como un
          ingreso nuevo.
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="monto"
          className="block text-sm font-semibold text-slate-700"
        >
          Monto
        </label>
        <input
          id="monto"
          type="number"
          min="0"
          inputMode="numeric"
          placeholder="$0"
          value={values.monto}
          onChange={(event) =>
            setValues((currentValues) => ({
              ...currentValues,
              monto: event.target.value,
            }))
          }
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
        {submitted && (values.monto.trim() === "" || Number(values.monto) <= 0) ? (
          <p className="text-sm text-red-500">Ingresa un monto v&aacute;lido.</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="categoria"
          className="block text-sm font-semibold text-slate-700"
        >
          Categor&iacute;a
        </label>
        <select
          id="categoria"
          value={values.categoria}
          onChange={(event) =>
            setValues((currentValues) => ({
              ...currentValues,
              categoria: event.target.value,
            }))
          }
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        >
          <option value="">Seleccionar categor&iacute;a</option>
          {categoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {submitted && values.categoria === "" ? (
          <p className="text-sm text-red-500">
            Selecciona una categor&iacute;a para el{" "}
            {labelsByType[values.tipo].toLowerCase()}.
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="descripcion"
          className="block text-sm font-semibold text-slate-700"
        >
          Descripci&oacute;n
        </label>
        <input
          id="descripcion"
          type="text"
          placeholder="Descripci&oacute;n (opcional)"
          value={values.descripcion}
          onChange={(event) =>
            setValues((currentValues) => ({
              ...currentValues,
              descripcion: event.target.value,
            }))
          }
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 text-base font-semibold text-white shadow-sm transition hover:from-blue-600 hover:to-blue-700"
        >
          {isEditing ? "Guardar cambios" : "Agregar movimiento"}
        </button>

        {isEditing ? (
          <button
            type="button"
            onClick={() => {
              onCancel();
              setSubmitted(false);
            }}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancelar
          </button>
        ) : null}
      </div>
    </form>
  );
};
