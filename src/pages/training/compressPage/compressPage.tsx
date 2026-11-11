import { ExampleView } from "../../../components/example";
import { compressExample } from "./example";
import "../../lessonPage.css";

export default function CompressPage() {
  return (
    <div className="page">
      <ExampleView example={compressExample} />
    </div>
  );
}
