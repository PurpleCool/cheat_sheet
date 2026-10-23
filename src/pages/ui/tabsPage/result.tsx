import { useState } from "react";
import { createPortal } from "react-dom";
import App from "./app";
import styles from "./styles.css?raw";
import "./preview.css";

const previewDocument = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Tabs preview</title></head><body></body></html>';

export default function Result() {
  const [body, setBody] = useState<HTMLElement | null>(null);

  return (
    <div className="tabs-preview">
      <iframe
        title="Tabs component preview"
        sandbox="allow-same-origin"
        srcDoc={previewDocument}
        onLoad={(event) => setBody(event.currentTarget.contentDocument?.body ?? null)}
      />
      {body && createPortal(<><style>{styles}</style><App /></>, body)}
    </div>
  );
}
