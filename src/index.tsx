import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Home } from "./pages/home";
import { UseContextPage } from "./pages/useContextPage";
import { UseRefPage } from "./pages/useRefPage";
import { PrimeNumbersPage } from "./pages/primeNumbersPage";
import { Navigation } from "./components/navigation";
import { paths } from "./constants";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <Navigation />
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path={paths.useContext} element={<UseContextPage />}></Route>
        <Route path={paths.useRef} element={<UseRefPage />}></Route>
        <Route path={paths.primeNumbers} element={<PrimeNumbersPage />}></Route>
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
