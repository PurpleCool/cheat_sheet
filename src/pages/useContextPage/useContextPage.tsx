import React from "react";

import { ExampleView } from "../../components/example";
import { useContextExample } from "./example";
import "../lessonPage.css";

export default function UseContextPage() {
  return (
    <div className='page'>
      <ExampleView example={useContextExample} />
    </div>
  );
}
