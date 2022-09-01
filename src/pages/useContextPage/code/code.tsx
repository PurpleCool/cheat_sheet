import React, { useEffect, useLayoutEffect } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-javascript"; // Language
import "prismjs/themes/prism.css"; // Theme
import "./code.css";

const themeContextCode = `import { createContext } from "react";

export const ThemeContext = createContext(true);`;

const parentCode = `export default function ContextParent() {
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
`;

const functionalComponentCode = `export default function FunctionContextComponent() {
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
`;

const classComponentCode = `export default class ClassContextComponent extends Component {
  getThemeStyles(isDarkTheme: boolean) {
    return {
      backgroundColor: isDarkTheme ? "#333" : "#ccc",
      color: isDarkTheme ? "#ccc" : "#333",
    };
  }

  render() {
    return (
      <ThemeContext.Consumer>
        {(darkTheme) => (
          <div className='ccc-example' style={this.getThemeStyles(darkTheme)}>
            Class Component Example
          </div>
        )}
      </ThemeContext.Consumer>
    );
  }
}`;

export default function Code() {
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <div className='code'>
      <span className='subheader'>theme Context Code:</span>
      <pre>
        <code className='language-javascript'>{themeContextCode}</code>
      </pre>
      <span className='subheader'>Parent component:</span>
      <pre>
        <code className='language-javascript'>{parentCode}</code>
      </pre>
      <span className='subheader'>Functional component:</span>
      <pre>
        <code className='language-javascript'>{functionalComponentCode}</code>
      </pre>
      <span className='subheader'>Class component:</span>
      <pre>
        <code className='language-javascript'>{classComponentCode}</code>
      </pre>
    </div>
  );
}
