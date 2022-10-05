import { useRef, useState } from "react";
import "./result.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

export default function BasicExample() {
  const [number, setNumber] = useState(0);
  const [isPrimeResult, setIsPrimeResult] = useState(true);
  const inputRef = useRef() as React.RefObject<HTMLInputElement>;

  const isPrime = () => {
    if (number < 2) {
      return false;
    }

    for (let i = 2; i <= number / 2; i += 1) {
      if (number % i === 0) {
        return false;
      }
    }

    return true;
  };

  const handlerClick = () => {
    console.time("isPrime");
    setIsPrimeResult(isPrime());
    console.timeEnd("isPrime");
  };

  return (
    <Form>
      <Form.Group className='mb-3' controlId='numberInput'>
        <Form.Label>Enter a number</Form.Label>
        <Form.Control
          ref={inputRef}
          type='number'
          value={number || ""}
          placeholder={`${number}`}
          onChange={(event) => setNumber(inputRef.current?.valueAsNumber || 0)}
        />
      </Form.Group>
      <Button variant='primary' onClick={handlerClick}>
        is primary?
      </Button>
      <p>{isPrimeResult.toString()}</p>
    </Form>
  );
}
