import React from "react";

import Codepen from "react-codepen-embed";
import { Result } from "./result";
import "./useContextPage.css";
import { Code } from "./code";
import { ResultCodeTable } from "../../layout/resultCodeTable";

export default function UseContextPage() {
  return (
    <>
      <ResultCodeTable>
        <Code />
        <Result />
      </ResultCodeTable>
      {/* <div className='divider'></div> */}
      <Codepen
        hash='gOzYVeV'
        user='PurpleCool'
        height={600}
        defaultTab='js,result'
        preview={false}
      />
    </>
  );
}
