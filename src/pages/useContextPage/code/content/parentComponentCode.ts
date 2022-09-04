export default `import { useState } from "react";
import { ThemeContext } from "./themeContext";
import ClassContextComponent from "./classContextComponent";
import FunctionContextComponent from "./functionContextComponent";

export default function ContextParent() {
  const [darkTheme, setDarkTheme] = useState(true);

  const toggleTheme = () => {
    setDarkTheme((prevTheme) => !prevTheme);
  };

  return (
    // You still need to wrap your functional component in the Provider
    <ThemeContext.Provider value={darkTheme}>
      <button onClick={toggleTheme}>
        Toggle Theme
      </button>
      <FunctionContextComponent />
      <ClassContextComponent />
    </ThemeContext.Provider>
  );
}
`;
