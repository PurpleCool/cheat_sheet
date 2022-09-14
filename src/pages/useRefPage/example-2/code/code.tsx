import React, { useEffect, useLayoutEffect } from "react";
import "./code.css";
import prevValue from "./content/prevValue";
import { CodeSnippet, Subheader, Wrapper } from "../../../../components/code";

export default function Code() {
  return (
    <Wrapper>
      <Subheader>How to use previous value:</Subheader>
      <CodeSnippet>{prevValue}</CodeSnippet>
    </Wrapper>
  );
}
