import React, { Children, useEffect } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-javascript"; // Language
import "prismjs/themes/prism.css"; // Theme
import "./style.css";

interface CodeSnippetProps {
  children: React.ReactNode;
}

export default function CodeSnippet({ children }: CodeSnippetProps) {
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <pre>
      <code className='language-javascript'>{children}</code>
    </pre>
  );
}
