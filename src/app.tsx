import { Navigate, Route, Routes } from "react-router-dom";
import { Navigation } from "./components/navigation";
import { paths } from "./constants";
import { Home } from "./pages/home";
import { UseContextPage } from "./pages/useContextPage";
import { UseRefPage } from "./pages/useRefPage";

export default function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route index element={<Home />} />
        <Route path={paths.useContext} element={<UseContextPage />} />
        <Route path={paths.useRef} element={<UseRefPage />} />
        <Route path="*" element={<Navigate to={paths.home} replace />} />
      </Routes>
    </>
  );
}
