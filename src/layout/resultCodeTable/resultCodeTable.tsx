import React, { Children } from "react";
import "./resultCodeTable.css";

interface ResultCodeTableProps {
  children: React.ReactNode;
}

export default function ResultCodeTable({ children }: ResultCodeTableProps) {
  return <div className='result-code-wrapper'>{children}</div>;
}
