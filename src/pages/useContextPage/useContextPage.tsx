import React from "react";

import Codepen from "react-codepen-embed";
import { ExampleView } from "../../components/example";
import { useContextExample } from "./example";
import "../lessonPage.css";

export default function UseContextPage() {
  return (
    <div className='page'>
      <ExampleView example={useContextExample} />
      {/* <div className='divider'></div> */}
      <Codepen
        hash='gOzYVeV'
        user='PurpleCool'
        height={600}
        defaultTab='js,result'
        preview={false}
        editable={true}
      />
    </div>
  );
}
