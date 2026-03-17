import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const MainLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      {/* Contenedor principal tipo app */}
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl overflow-hidden">
        
        {/* 🔝 Header */}
        <header className="flex items-center justify-between px-4 py-3 border-b">
          <h1 className="text-lg font-semibold text-gray-800">
            Mis Finanzas
          </h1>
          <button className="text-gray-500 hover:text-gray-700">
            ⚙️
          </button>
        </header>

        {/* 📄 Contenido */}
        <main className="p-4 space-y-4">
          {children}
        </main>

      </div>
    </div>
  );
};