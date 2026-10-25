import { ExampleView } from "../../../components/example";
import { reduceExample } from "./example";
import "../../lessonPage.css";

export default function ReducePage() {
  return (
    <div className="page">
      <ExampleView example={reduceExample} />
    </div>
  );
}
