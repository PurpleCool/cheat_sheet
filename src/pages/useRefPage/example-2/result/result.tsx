import { useEffect, useRef, useState } from "react";

export default function Result() {
  const [name, setName] = useState("");
  const prevName = useRef("");
  const renderCount = useRef(1);

  useEffect(() => {
    renderCount.current += 1;
    prevName.current = name;
  });

  return (
    <div className="result">
      <label htmlFor="previous-value-name">Name for previous value</label>
      <input
        id="previous-value-name"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <p>
        My name is <strong>{name}</strong> and it used to be{" "}
        <strong>{prevName.current}</strong>
      </p>
      <p>
        I rendered <strong>{renderCount.current}</strong> times
      </p>
    </div>
  );
}
