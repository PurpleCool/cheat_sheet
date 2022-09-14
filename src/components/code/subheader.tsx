import React, { Children } from "react";
import "./style.css";

interface SubheaderProps {
  children: React.ReactNode;
}

export default function Subheader({ children }: SubheaderProps) {
  return <div className='subheader'>{children}</div>;
}
