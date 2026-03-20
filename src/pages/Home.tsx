import { CardBalance } from "../components/CardBalance";
import { FormMovimiento } from "../components/FormMovimiento";
import { ListaMovimientos } from "../components/ListaMovimientos";

export const Home = () => {
  const fecha = new Date();
  const mes = fecha.toLocaleString("es-CO", { month: "long" });
  // const año = fecha.getFullYear();
  const dia = fecha.getDate();
  return (
    <div className="space-y-5">
      <div className="bg-white w-full h-20 rounded-2xl flex flex-col justify-center px-5 shadow-sm">
        <h2 className="text-xl font-bold">Hola Ordogen</h2>
        <p>
          Resumen del mes:{" "}
          <span className="font-bold capitalize">
            {mes} {dia}
          </span>
        </p>
      </div>
      <CardBalance />
      <hr className="border border-gray-300" />
      <ListaMovimientos />
      <hr className="border border-gray-300" />
      <FormMovimiento />
    </div>
  );
};
