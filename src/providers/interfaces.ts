import React, { ReactNode } from "react";
import { IThemeColor } from "../configs/colors.config";

export type IThemeName = "light" | "dark";

export type IButtonThemeColors =
  | "textColor"
  | "backgroundColor"
  | "textColorDisabled"
  | "backgroundColorDisabled"
  | "activeColor"
  | "spinnerColor"
  | "spinnerColorDisabled"
  | "borderColor"
  | "borderColorDisabled";

export interface IThemeContext {
  changeTheme: (name: IThemeName) => void;
  currentTheme: IThemeName;
  themeColors: Record<IThemeColor, string>;
}

export type IThemeProviderProps = React.FC<{
  children?: ReactNode;
}>;

export interface IThemeSwitchWaitProps {
  spinnerColor?: string;
  backgroundColor: string;
  textColor: string;
}
