import { useEffect, useRef, useState } from "react";

export default function Result() {
  const [name, setName] = useState("");
  const prevName = useRef("");
  const renderCount = useRef(1);
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    renderCount.current += 1;
    prevName.current = name;
  });

  return (
    <div className="result">
      <input
        ref={inputRef}
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
      <button onClick={focusInput} type="button">
        Focus on input
      </button>
    </div>
  );
}
