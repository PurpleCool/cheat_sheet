import { ExampleView } from "../../../components/example";
import { holyGrailExample } from "./example";
import "../../lessonPage.css";

export default function HolyGrailPage() {
  return (
    <div className="page">
      <ExampleView example={holyGrailExample} />
    </div>
  );
}
