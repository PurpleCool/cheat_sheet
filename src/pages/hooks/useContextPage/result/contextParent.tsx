import { useState } from "react";
import { ThemeContext } from "./themeContext";
import ClassContextComponent from "./classContextComponent";
import FunctionContextComponent from "./functionContextComponent";
import "./result.css";

export default function ContextParent() {
  const [darkTheme, setDarkTheme] = useState(true);

  const toggleTheme = () => {
    setDarkTheme((prevTheme) => !prevTheme);
  };

  return (
    // You still need to wrap your functional component in the Provider
    <ThemeContext.Provider value={darkTheme}>
      <button className='toggle-btn' onClick={toggleTheme}>
        Toggle Theme
      </button>
      <FunctionContextComponent />
      <ClassContextComponent />
    </ThemeContext.Provider>
  );
}
