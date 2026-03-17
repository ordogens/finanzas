import { createRoot } from "react-dom/client";
import { FinanzasProvider } from "./context/FinanzasContext";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { App } from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <FinanzasProvider>  

      <App />
      
    </FinanzasProvider>
  </BrowserRouter>,
);
