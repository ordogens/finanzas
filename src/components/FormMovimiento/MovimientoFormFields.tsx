import { useState, type FormEvent } from "react";
import { categoriasPorTipo } from "../../data/formMovimiento";
import type { FormMovimientoValues } from "../../types/formMovimiento";
import type { MovimientoTipo } from "../../types/movimiento";
import { labelsByType } from "./constants";
import { getShortcutCategoryByType } from "./utils";

type MovimientoFormFieldsProps = {
  initialValues: FormMovimientoValues;
  isEditing: boolean;
  onSubmitValues: (values: FormMovimientoValues) => void;
  onCancel: () => void;
};

export const MovimientoFormFields = ({
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
      categoria: getShortcutCategoryByType(tipo),
    }));
  };

  const handleShortcutClick = (tipo: MovimientoTipo) => {
    setValues((currentValues) => ({
      ...currentValues,
      tipo,
      categoria: getShortcutCategoryByType(tipo),
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
        <label htmlFor="tipo" className="block text-sm font-semibold text-slate-200">
          Tipo
        </label>
        <select
          id="tipo"
          value={values.tipo}
          onChange={(event) => handleTypeChange(event.target.value as MovimientoTipo)}
          className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-slate-100 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="income">Ingreso</option>
          <option value="expense">Gasto</option>
          <option value="saving">Ahorro</option>
          <option value="debt">Abono deuda</option>
        </select>
        <div className="grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => handleShortcutClick("saving")}
            className="w-full rounded-xl border border-blue-700/50 bg-blue-950/40 px-4 py-3 text-left text-sm font-semibold text-blue-400 transition hover:border-blue-600/60 hover:bg-blue-950/60"
          >
            Registrar aporte a ahorro
          </button>
          <button
            type="button"
            onClick={() => handleShortcutClick("debt")}
            className="w-full rounded-xl border border-amber-700/50 bg-amber-950/40 px-4 py-3 text-left text-sm font-semibold text-amber-400 transition hover:border-amber-600/60 hover:bg-amber-950/60"
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
        <label htmlFor="monto" className="block text-sm font-semibold text-slate-200">
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
          className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
        {submitted && (values.monto.trim() === "" || Number(values.monto) <= 0) ? (
          <p className="text-sm text-red-500">Ingresa un monto v&aacute;lido.</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="categoria"
          className="block text-sm font-semibold text-slate-200"
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
          className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-slate-100 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
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
          className="block text-sm font-semibold text-slate-200"
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
          className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
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
            className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-base font-semibold text-slate-200 transition hover:bg-slate-700"
          >
            Cancelar
          </button>
        ) : null}
      </div>
    </form>
  );
};
