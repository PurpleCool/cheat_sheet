import React, { createContext, useState } from "react";
import ClassContextComponent from "./classContextComponent";
import FunctionContextComponent from "./functionContextComponent";
import { ThemeContext } from "./themeContext";
import "./result.css";

export default function ContextParent() {
  const [darkTheme, setDarkTheme] = useState(true);

  const toggleTheme = () => {
    setDarkTheme((prevTheme) => !prevTheme);
  };

  return (
    <ThemeContext.Provider value={darkTheme}>
      <button className="toggle-btn" onClick={toggleTheme}>Toggle Theme</button>
      <FunctionContextComponent />
      <ClassContextComponent />
    </ThemeContext.Provider>
  );
}
