import React, { useEffect, useLayoutEffect } from "react";
import renderCount from "./content/renderCount";
import { CodeSnippet, Subheader, Wrapper } from "../../../../components/code";

export default function Code() {
  return (
    <Wrapper>
      <Subheader>How to count the number of rerenders:</Subheader>
      <CodeSnippet>{renderCount}</CodeSnippet>
    </Wrapper>
  );
}
