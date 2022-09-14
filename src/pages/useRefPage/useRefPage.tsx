import React from "react";
import Codepen from "react-codepen-embed";

import { Example1 } from "./example-1";
import { Example2 } from "./example-2";
import { Example3 } from "./example-3";
import { Code } from "./example-1/code";
import { ResultCodeTable } from "../../layout/resultCodeTable";
import "./useRefPage.css";

export default function UseRefPage() {
  return (
    <div className='page'>
      <Example1 />
      <div className='divider'></div>
      <Example2 />
      <div className='divider'></div>
      <Example3 />
      <div className='divider'></div>
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
