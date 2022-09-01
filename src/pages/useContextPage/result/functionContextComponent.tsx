import React, { useContext } from "react";
import { ThemeContext } from "./themeContext";

export default function FunctionContextComponent() {
  const darkTheme = useContext(ThemeContext);
  const getThemeStyles = (isDarkTheme: boolean) => {
    return {
      backgroundColor: isDarkTheme ? "#333" : "#ccc",
      color: isDarkTheme ? "#ccc" : "#333",
    };
  };

  return (
    <div className='fcc-example' style={getThemeStyles(darkTheme)}>
      Functional Component Example
    </div>
  );
}
