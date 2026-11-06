import { ExampleView } from "../../../components/example";
import { useThrottleWithLeadingExample } from "./example";
import "../../lessonPage.css";

export default function UseThrottleWithLeadingPage() {
  return (
    <div className="page">
      <ExampleView example={useThrottleWithLeadingExample} />
    </div>
  );
}
