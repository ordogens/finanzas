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
    <div className="space-y-5 text-slate-100">
      <div className="flex min-h-20 w-full flex-col justify-center rounded-[24px] border border-slate-800 bg-slate-950/80 px-5 py-4 shadow-[0_18px_36px_-26px_rgba(15,23,42,0.9)] ring-1 ring-white/5">
        <h2 className="text-xl font-bold capitalize text-white">Hola {displayName}</h2>
        <p className="text-slate-300">
          Resumen del mes:{" "}
          <span className="font-bold capitalize text-white">
            {mes} {dia}
          </span>
        </p>
      </div>
      <CardBalance />
      <hr className="border border-slate-800" />
      <ListaMovimientos />
      <hr className="border border-slate-800" />
      <FormMovimiento />
    </div>
  );
};
