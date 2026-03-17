import { CardBalance } from "../components/CardBalance";
import { FormMovimiento } from "../components/FormMovimiento";
import { ListaMovimientos } from "../components/ListaMovimientos";

export const Home = () => {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold ">Hola Ordogen</h2>
      <p>resumen del mes: <span className="font-bold">Marzo</span></p>
      <CardBalance />
      <hr className="border border-gray-300" />
      <ListaMovimientos />
      <hr className="border border-gray-300" />
      <FormMovimiento />
    </div>
  );
};
