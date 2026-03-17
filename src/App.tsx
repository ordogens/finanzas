import { MainLayout } from "./layouts/MainLayout";
import { Home } from "./pages/Home";
import "./App.css";

export const App = () => {
  return (
    <>
      <MainLayout>
        <Home />
      </MainLayout>
    </>
  );
};
