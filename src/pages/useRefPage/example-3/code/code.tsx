import React, { useEffect, useLayoutEffect } from "react";
import inputFocus from "./content/inputFocus";
import { CodeSnippet, Subheader, Wrapper } from "../../../../components/code";

export default function Code() {

  return (
    <Wrapper>
      <Subheader>How to use previous value:</Subheader>
      <CodeSnippet>{inputFocus}</CodeSnippet>
    </Wrapper>
  );
}
