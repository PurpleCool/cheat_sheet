import React, { Children } from "react";
import "./style.css";

interface WrapperProps {
  children: React.ReactNode;
}

export default function Wrapper({ children }: WrapperProps) {
  return <div className='wrapper'>{children}</div>;
}
