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
      <h2 className="text-xl font-bold ">Hola Ordogen</h2>
      <p>Resumen del mes: <span className="font-bold capitalize">{mes} {dia}</span></p>
      <CardBalance />
      <hr className="border border-gray-300" />
      <ListaMovimientos />
      <hr className="border border-gray-300" />
      <FormMovimiento />
    </div>
  );
};
