import React, { useEffect, useRef, useState } from "react";

export default function Result() {
  const [name, setName] = useState("");
  const renderCount = useRef(1);

  useEffect(() => {
    console.log("useEffect");
    renderCount.current = renderCount.current + 1;
  });

  return (
    <div className='result'>
      <input value={name} onChange={(event) => setName(event.target.value)} />
      <p>
        My name is <strong>{name}</strong>
      </p>
      <p>
        I rendered <strong>{renderCount.current}</strong> times
      </p>
    </div>
  );
}
