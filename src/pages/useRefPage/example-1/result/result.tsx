import React, { useEffect, useRef, useState } from "react";


export default function Result() {
  const [name, setName] = useState('');
  // const prevName = useRef('');
  const renderCount = useRef(1);
  // const inputRef = useRef() as React.RefObject<HTMLInputElement>;


  // const focus = () => {
  //   console.log(inputRef);
  //   inputRef.current?.focus();
  // }

  useEffect(() => {
    console.log('useEffect');
    renderCount.current = renderCount.current + 1;
    // prevName.current = name;
  });


  return (
    <div className="result">
      <input 
        // ref={inputRef}
        value={name}
        onChange={event => setName(event.target.value)}/>
      <p>My name is <strong>{name}</strong>
       {/* and it used to be <strong>{prevName.current}</strong> */}
       </p>
      <p>I rendered <strong>{renderCount.current}</strong> times</p>
      {/* <button onFocus={focus}>Focus on input</button> */}
    </div>
  );
}
