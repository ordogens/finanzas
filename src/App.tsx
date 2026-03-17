import { Routes, Route } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { Home } from "./pages/Home";
import { Historial } from "./pages/Historial";
import "./App.css";

export const App = () => {
  return (
    <>
      <MainLayout>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/historial" element={<Historial />} />
        </Routes>
      </MainLayout>
    </>
  );
};
