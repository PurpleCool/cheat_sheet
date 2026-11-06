import { ExampleView } from "../../../components/example";
import { useHoverExample } from "./example";
import "../../lessonPage.css";

export default function UseHoverPage() {
  return (
    <div className="page">
      <ExampleView example={useHoverExample} />
    </div>
  );
}
