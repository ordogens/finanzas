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
    <section className="border-t border-slate-200 pt-5">
      <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
              Movimientos
            </p>
            <h3 className="mt-1 text-xl font-bold text-slate-700">
              {isEditing ? "Editar movimiento" : "Agregar movimiento"}
            </h3>
          </div>

          <button
            type="button"
            onClick={() => {
              if (isEditing) {
                cancelEditing();
              }

              setIsExpanded((current) => !current);
            }}
            aria-expanded={isOpen}
            className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-200 ${
              isOpen
                ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                : "bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-500 text-white hover:from-blue-600 hover:via-sky-600 hover:to-cyan-600"
            }`}
          >
            {isOpen ? (
              <>
                <X className="h-4 w-4" />
                Cerrar
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Nuevo movimiento
              </>
            )}
          </button>
        </div>

        {isOpen ? (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
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
        ) : null}
      </div>
    </section>
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
      categoria: "",
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
        </select>
        <button
          type="button"
          onClick={() =>
            setValues((currentValues) => ({
              ...currentValues,
              tipo: "income",
              categoria: "ahorro",
            }))
          }
          className="w-full rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-left text-sm font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-100"
        >
          Registrar aporte a ahorro
        </button>
        <p className="text-xs text-slate-500">
          Si quieres sumar dinero a tu meta, usa este acceso directo o elige
          `Ingreso` y luego la categor&iacute;a `Ahorro`.
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
