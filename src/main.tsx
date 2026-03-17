import { createRoot } from "react-dom/client";
import { FinanzasProvider } from "./context/FinanzasContext";
import "./index.css";
import { App } from "./App.tsx";

createRoot(document.getElementById('root')!).render(
  <FinanzasProvider>
    <App />
  </FinanzasProvider>
);
