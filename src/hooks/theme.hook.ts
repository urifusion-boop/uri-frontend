import React from "react";
import { IThemeContext } from "@/providers/interfaces";
import { ThemeContext } from "@/providers/ThemeProvider";

interface ICustomThemeColors {
  light: Record<string, string>;
  dark: Record<string, string>;
}

interface IResult extends IThemeContext {
  customColors: Record<string, string>;
}

/**
 * This hook is used to connect to the react theme context.
 * @returns IThemeContext
 */
export default function useCustomTheme(
  customThemeColors?: ICustomThemeColors
): IResult {
  // get the theme's context
  const theme = React.useContext(ThemeContext);
  // handle check for when the them is not available
  React.useEffect(() => {
    if (!theme) {
      console.warn(
        "It is not allowed to use the theme context outside the theme provider."
      );
    }
  }, [theme]);
  // return the theme
  return {
    ...theme,
    customColors:
      customThemeColors && customThemeColors[theme.currentTheme]
        ? customThemeColors[theme.currentTheme]
        : {},
  };
}
