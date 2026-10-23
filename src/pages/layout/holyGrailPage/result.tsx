import { useId, useState } from "react";
import { createPortal } from "react-dom";
import App from "./app";
import styles from "./styles.css?raw";
import "./preview.css";

const previewDocument = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Holy Grail preview</title></head><body></body></html>';

export default function Result() {
  const id = useId();
  const [body, setBody] = useState<HTMLElement | null>(null);
  const [size, setSize] = useState({ width: 600, height: 480 });

  return (
    <div className="holy-grail-preview">
      <div className="holy-grail-preview-controls">
        <label htmlFor={`${id}-width`}>Ширина</label>
        <input
          id={`${id}-width`}
          type="range"
          min={240}
          max={1200}
          value={size.width}
          onChange={(event) => setSize({ ...size, width: Number(event.currentTarget.value) })}
        />
        <span>{size.width}px</span>
        <label htmlFor={`${id}-height`}>Высота</label>
        <input
          id={`${id}-height`}
          type="range"
          min={200}
          max={900}
          value={size.height}
          onChange={(event) => setSize({ ...size, height: Number(event.currentTarget.value) })}
        />
        <span>{size.height}px</span>
      </div>
      <div className="holy-grail-preview-viewport">
        <iframe
          title="Holy Grail layout preview"
          sandbox="allow-same-origin"
          srcDoc={previewDocument}
          style={{ width: size.width, height: size.height }}
          onLoad={(event) => setBody(event.currentTarget.contentDocument?.body ?? null)}
        />
      </div>
      {body && createPortal(<><style>{styles}</style><App /></>, body)}
    </div>
  );
}
