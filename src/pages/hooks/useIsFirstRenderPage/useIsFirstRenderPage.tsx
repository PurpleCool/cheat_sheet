import { ExampleView } from "../../../components/example";
import { useIsFirstRenderExample } from "./example";
import "../../lessonPage.css";

export default function UseIsFirstRenderPage() {
  return (
    <div className="page">
      <ExampleView example={useIsFirstRenderExample} />
    </div>
  );
}
