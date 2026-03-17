import { useEffect, useState, type FormEvent } from "react";
import { categoriasPorTipo } from "../data/formMovimiento";
import { useFinanzas } from "../context/FinanzasContext";
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
  const [values, setValues] = useState<FormMovimientoValues>(initialValues);
  const [submitted, setSubmitted] = useState(false);

  const isEditing = editingMovimiento !== null;
  const categoryOptions = categoriasPorTipo[values.tipo];
  const isFormValid =
    values.monto.trim() !== "" &&
    Number(values.monto) > 0 &&
    values.categoria !== "";

  useEffect(() => {
    if (!editingMovimiento) {
      setValues(initialValues);
      setSubmitted(false);
      return;
    }

    setValues({
      tipo: editingMovimiento.type,
      monto: String(editingMovimiento.amount),
      categoria: editingMovimiento.category,
      descripcion: editingMovimiento.description,
    });
    setSubmitted(false);
  }, [editingMovimiento]);

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

    if (editingMovimiento) {
      updateMovimiento(editingMovimiento.id, values);
    } else {
      addMovimiento(values);
    }

    setValues(initialValues);
    setSubmitted(false);
  };

  return (
    <section className="border-t border-slate-200 pt-5">
      <h3 className="mb-4 text-xl font-bold text-slate-700">
        {isEditing ? "Editar Movimiento" : "Añadir Movimiento"}
      </h3>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
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
            {submitted &&
            (values.monto.trim() === "" || Number(values.monto) <= 0) ? (
              <p className="text-sm text-red-500">Ingresa un monto válido.</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="categoria"
              className="block text-sm font-semibold text-slate-700"
            >
              Categoría
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
              <option value="">Seleccionar categoría</option>
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {submitted && values.categoria === "" ? (
              <p className="text-sm text-red-500">
                Selecciona una categoría para el{" "}
                {labelsByType[values.tipo].toLowerCase()}.
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="descripcion"
              className="block text-sm font-semibold text-slate-700"
            >
              Descripción
            </label>
            <input
              id="descripcion"
              type="text"
              placeholder="Descripción (opcional)"
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
              {isEditing ? "Guardar Cambios" : "Agregar Movimiento"}
            </button>

            {isEditing ? (
              <button
                type="button"
                onClick={() => {
                  cancelEditing();
                  setValues(initialValues);
                  setSubmitted(false);
                }}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancelar
              </button>
            ) : null}
          </div>
        </form>
      </div>
    </section>
  );
};
