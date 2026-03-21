import { CardBalance } from "../components/CardBalance";
import { FormMovimiento } from "../components/FormMovimiento";
import { ListaMovimientos } from "../components/ListaMovimientos";
import { useAuth } from "../context/useAuth";

export const Home = () => {
  const fecha = new Date();
  const mes = fecha.toLocaleString("es-CO", { month: "long" });
  const dia = fecha.getDate();
  const { user } = useAuth();
  const displayName = user?.name ?? "invitado";

  return (
    <div className="space-y-5">
      <div className="flex h-20 w-full flex-col justify-center rounded-2xl bg-white px-5 shadow-sm">
        <h2 className="text-xl font-bold capitalize">Hola {displayName}</h2>
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
