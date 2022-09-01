import React, { Component } from "react";
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
          <div className='ccc-example' style={this.getThemeStyles(darkTheme)}>
            Class Component Example
          </div>
        )}
      </ThemeContext.Consumer>
    );
  }
}
