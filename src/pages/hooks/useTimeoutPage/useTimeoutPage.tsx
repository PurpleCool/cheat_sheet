import { ExampleView } from "../../../components/example";
import { useTimeoutExample } from "./example";
import "../../lessonPage.css";

export default function UseTimeoutPage() {
  return (
    <div className="page">
      <ExampleView example={useTimeoutExample} />
    </div>
  );
}
