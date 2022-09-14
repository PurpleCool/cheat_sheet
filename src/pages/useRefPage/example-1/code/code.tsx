import React, { useEffect, useLayoutEffect } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-javascript"; // Language
import "prismjs/themes/prism.css"; // Theme
import "./code.css";
import renderCount from "./content/renderCount";

export default function Code() {
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <div className='code'>
      <span className='subheader'>How to count the number of rerenders:</span>
      <pre>
        <code className='language-javascript'>{renderCount}</code>
      </pre>
    </div>
  );
}
