import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const MainLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      {/* Contenedor principal tipo app */}
      <div className="w-full max-w-md bg-gray-200 shadow-lg rounded-xl overflow-hidden">
        {/* 🔝 Header */}
        <header className="flex items-center justify-between px-4 py-3 border-b bg-white border-b border-gray-300">
          <div className="border border-black w-10 h-10 rounded-full flex gap-12 items-center ">
            <img src="" alt="" />

            <h1 className="text-lg text-gray-800 font-bold">Monify</h1>
          </div>

          <button className="text-gray-500 hover:text-gray-700">⚙️</button>
        </header>

        {/* 📄 Contenido */}
        <main className="p-4 space-y-4">{children}</main>
      </div>
    </div>
  );
};
