import { Navigate, Route, Routes } from "react-router-dom";
import { Navigation } from "./components/navigation";
import { pageRegistry } from "./pageRegistry/registry";
import type { PageRegistry } from "./pageRegistry/types";

export default function App({
  registry = pageRegistry,
}: { registry?: PageRegistry }) {
  return (
    <>
      <Navigation registry={registry} />
      <Routes>
        {registry.pages.map(({ id, path, component: Page }) => (
          <Route key={id} path={path} element={<Page />} />
        ))}
        <Route path="*" element={<Navigate to={registry.home.path} replace />} />
      </Routes>
    </>
  );
}
