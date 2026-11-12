import { ExampleView } from "../../../components/example";
import { quickStartExample } from "./example";
import "../../lessonPage.css";

export default function QuickStartPage() {
  return (
    <div className="page">
      <ExampleView example={quickStartExample} />
    </div>
  );
}
