import type { ReactNode } from "react";
import "./resultCodeTable.css";

interface ResultCodeTableProps {
  children: ReactNode;
}

export default function ResultCodeTable({ children }: ResultCodeTableProps) {
  return <div className='result-code-wrapper'>{children}</div>;
}
