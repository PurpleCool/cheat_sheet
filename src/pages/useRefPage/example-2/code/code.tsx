import React, { useEffect, useLayoutEffect } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-javascript"; // Language
import "prismjs/themes/prism.css"; // Theme
import "./code.css";
import prevValue from "./content/prevValue";

export default function Code() {
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <div className='code'>
      <span className='subheader'>How to use previous value:</span>
      <pre>
        <code className='language-javascript'>{prevValue}</code>
      </pre>
    </div>
  );
}
