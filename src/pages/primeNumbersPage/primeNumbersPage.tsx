import React from "react";

import Codepen from "react-codepen-embed";
import { Result } from "./result";
import { Code } from "./code";
import { ResultCodeTable } from "../../layout/resultCodeTable";
import "./primeNumbersPage.css";

export default function PrimeNumbersPage() {
  return (
    <div className='page'>
      <ResultCodeTable>
        <Code />
        <Result />
      </ResultCodeTable>
      {/* <div className='divider'></div> */}
      {/* <Codepen
        hash='gOzYVeV'
        user='PurpleCool'
        height={600}
        defaultTab='js,result'
        preview={false}
        editable={true}
      /> */}
    </div>
  );
}
