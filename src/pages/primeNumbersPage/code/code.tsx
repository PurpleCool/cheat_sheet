import React, { useEffect, useLayoutEffect } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-javascript"; // Language
import "prismjs/themes/prism.css"; // Theme
import "./code.css";
import basicExampleCode from "./content/basicExampleCode";

export default function Code() {
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <div className='code'>
      <span className='subheader'>theme Context Code:</span>
      <pre>
        <code className='language-javascript'>{basicExampleCode}</code>
      </pre>
    </div>
  );
}
