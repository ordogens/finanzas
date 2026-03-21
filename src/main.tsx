import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App.tsx";
import { AuthProvider } from "./context/AuthContext";
import { FinanzasProvider } from "./context/FinanzasProvider";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <FinanzasProvider>
        <App />
      </FinanzasProvider>
    </AuthProvider>
  </BrowserRouter>
);
