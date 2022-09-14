import React, { useEffect, useLayoutEffect } from "react";
import themeContextCode from "./content/themeContextCode";
import parentComponentCode from "./content/parentComponentCode";
import functionalComponentCode from "./content/functionalComponentCode";
import classComponentCode from "./content/classComponentCode";
import { CodeSnippet, Subheader, Wrapper } from "../../../components/code";

export default function Code() {
  return (
    <Wrapper>
      <Subheader>theme Context Code:</Subheader>
      <CodeSnippet>{themeContextCode}</CodeSnippet>
      <Subheader>Parent component:</Subheader>
      <CodeSnippet>{parentComponentCode}</CodeSnippet>
      <Subheader>Functional component:</Subheader>
      <CodeSnippet>{functionalComponentCode}</CodeSnippet>
      <Subheader>Class component:</Subheader>
      <CodeSnippet>{classComponentCode}</CodeSnippet>
    </Wrapper>
  );
}
