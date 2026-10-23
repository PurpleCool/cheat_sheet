import { ExampleView } from "../../../components/example";
import { fetchWithRetriesExample } from "./example";
import "../../lessonPage.css";

export default function FetchWithRetriesPage() {
  return (
    <div className="page">
      <ExampleView example={fetchWithRetriesExample} />
    </div>
  );
}
