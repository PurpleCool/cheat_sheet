import { ExampleView } from "../../../components/example";
import { usePreviousExample } from "./example";
import "../../lessonPage.css";

export default function UsePreviousPage() {
  return (
    <div className="page">
      <ExampleView example={usePreviousExample} />
    </div>
  );
}
