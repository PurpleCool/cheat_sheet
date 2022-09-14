export default `import React, { useEffect, useRef, useState } from "react";

export default function Result() {
  const [name, setName] = useState('');
  const prevName = useRef('');
  const renderCount = useRef(1);

  useEffect(() => {
    console.log('useEffect');
    renderCount.current = renderCount.current + 1;
    prevName.current = name;
  });


  return (
    <div className="result">
      <input value={name} onChange={event => setName(event.target.value)}/>
      <p>My name is <strong>{name}</strong> and it used to be <strong>{prevName.current}</strong></p>
      <p>I rendered <strong>{renderCount.current}</strong> times</p>
    </div>
  );
}
`;
