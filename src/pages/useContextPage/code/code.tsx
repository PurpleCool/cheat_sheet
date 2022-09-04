import React, { useEffect, useLayoutEffect } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-javascript"; // Language
import "prismjs/themes/prism.css"; // Theme
import "./code.css";
import themeContextCode from "./content/themeContextCode";
import parentComponentCode from "./content/parentComponentCode";
import functionalComponentCode from "./content/functionalComponentCode";
import classComponentCode from "./content/classComponentCode";

export default function Code() {
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <div className='code'>
      <span className='subheader'>theme Context Code:</span>
      <pre>
        <code className='language-javascript'>{themeContextCode}</code>
      </pre>
      <span className='subheader'>Parent component:</span>
      <pre>
        <code className='language-javascript'>{parentComponentCode}</code>
      </pre>
      <span className='subheader'>Functional component:</span>
      <pre>
        <code className='language-javascript'>{functionalComponentCode}</code>
      </pre>
      <span className='subheader'>Class component:</span>
      <pre>
        <code className='language-javascript'>{classComponentCode}</code>
      </pre>
    </div>
  );
}
