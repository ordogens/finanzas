import type { ReactNode } from "react";
import monify from "../assets/monify.png";

type Props = {
  children: ReactNode;
};

export const MainLayout = ({ children }: Props) => {
  return (
    <div className="flex min-h-screen justify-center bg-gray-100">
      <div className="w-full max-w-md overflow-hidden rounded-xl bg-gray-200 shadow-lg">
        <header className="flex items-center justify-between border-b border-gray-300 bg-white px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-black bg-white">
              <img
                src={monify}
                alt="Logo de Monify"
                className="h-full w-full object-cover object-center"
              />
            </div>

            <h1 className="text-lg font-bold text-gray-800">Monify</h1>
          </div>

          <button className="text-gray-500 hover:text-gray-700">⚙️</button>
        </header>

        <main className="space-y-4 p-4">{children}</main>
      </div>
    </div>
  );
};
