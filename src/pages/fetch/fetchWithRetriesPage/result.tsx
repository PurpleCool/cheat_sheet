import { useRef, useState } from "react";
import { fetchWithRetries, parseResult } from "./fetchWithRetries";

export default function Result() {
  const retries = useRef<HTMLInputElement | null>(null);
  const [result, setResult] = useState("");

  const fetch = async () => {
    const inputText = retries.current?.value;
    const retriesCount = inputText ? Number(inputText) : 0;

    try {
      const response = await fetchWithRetries(
        retriesCount,
        "https://jsonplaceholder.typicode.com/todos/1",
      );
      const parsedData = await parseResult(response);
      setResult(JSON.stringify(parsedData));
    } catch (e) {
      setResult(e instanceof Error ? e.message : "could not get data");
    }
  };

  return (
    <div>
      <button onClick={fetch}>fetch</button>
      <br />
      <label>
        Retries:
        <input type='number' ref={retries}></input>
      </label>
      <br />
      result:
      {result}
    </div>
  );
}
