import { ExampleView } from "../../../components/example";
import { storeExample } from "./example";
import "../../lessonPage.css";

export default function StorePage() {
  return (
    <div className="page">
      <ExampleView example={storeExample} />
    </div>
  );
}
