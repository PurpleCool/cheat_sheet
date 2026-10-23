import { ExampleView } from "../../../components/example";
import { tabsExample } from "./example";
import "../../lessonPage.css";

export default function TabsPage() {
  return (
    <div className="page">
      <ExampleView example={tabsExample} />
    </div>
  );
}
