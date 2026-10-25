import { ExampleView } from "../../../components/example";
import { asyncAwaitExample } from "./example";
import "../../lessonPage.css";

export default function AsyncAwaitPage() {
  return (
    <div className="page">
      <ExampleView example={asyncAwaitExample} />
    </div>
  );
}
