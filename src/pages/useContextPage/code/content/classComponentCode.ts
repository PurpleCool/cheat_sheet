export default `import { Component } from "react";
// You need to import ThemeContext to know the current state 
import { ThemeContext } from "./themeContext";

export default class ClassContextComponent extends Component {
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
          <div style={this.getThemeStyles(darkTheme)}>
            Class Component Example
          </div>
        )}
      </ThemeContext.Consumer>
    );
  }
}
`;
