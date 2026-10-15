import React from "react";
import Codepen from "react-codepen-embed";

import { ExampleView } from "../../components/example";
import { useRefExamples } from "./examples";
import "../lessonPage.css";

export default function UseRefPage() {
  return (
    <div className='page'>
      {useRefExamples.map((example) => (
        <React.Fragment key={example.id}>
          <ExampleView example={example} />
          <div className='divider'></div>
        </React.Fragment>
      ))}
      <Codepen
        hash='XWqNzeX'
        user='PurpleCool'
        height={600}
        defaultTab='js,result'
        preview={false}
        editable={true}
      />
    </div>
  );
}
