import { useState } from "react";

const tabContent = [
  <p>
    The HyperText Markup Language or HTML is the standard markup language
    for documents designed to be displayed in a web browser.
  </p>,
  <p>
    Cascading Style Sheets is a style sheet language used for describing
    the presentation of a document written in a markup language such as
    HTML or XML.
  </p>,
  <p>
    JavaScript, often abbreviated as JS, is a programming language that is
    one of the core technologies of the World Wide Web, alongside HTML and
    CSS.
  </p>,
];

export default function Tabs() {
  const [activeTabIdx, setActiveTabIdx] = useState(0);

  const setTab = (element: HTMLButtonElement | undefined) => {
    if (!element) {
      return;
    }

    const idx = element.dataset?.idx;
    if (!idx) {
      return;
    }

    setActiveTabIdx(Number(idx));
  };

  return (
    <div>
      <div>
        <button onClick={(e) => setTab(e.currentTarget)} className={activeTabIdx === 0 ? "active" : ""} data-idx="0">HTML</button>
        <button onClick={(e) => setTab(e.currentTarget)} className={activeTabIdx === 1 ? "active" : ""} data-idx="1">CSS</button>
        <button onClick={(e) => setTab(e.currentTarget)} className={activeTabIdx === 2 ? "active" : ""} data-idx="2">JavaScript</button>
      </div>
      <div>
        {tabContent?.[activeTabIdx]}
      </div>
    </div>
  );
}
