export default `import { useContext } from "react";
// You need to import ThemeContext to know the current state 
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
    <div style={getThemeStyles(darkTheme)}>
      Functional Component Example
    </div>
  );
}
`;

