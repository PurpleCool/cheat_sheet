import { ExampleView } from "../../../components/example";
import { debounceExample } from "./example";
import "../../lessonPage.css";

export default function DebouncePage() {
  return (
    <div className="page">
      <ExampleView example={debounceExample} />
    </div>
  );
}
