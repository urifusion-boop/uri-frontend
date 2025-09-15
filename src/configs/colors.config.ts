/**
 * @deprecated use theme color
 */
const colors = {};

export type IThemeColor =
  | "primary"
  | "background"
  | "surface"
  | "secondary"
  | "blackWhite"
  | "placeholder"
  | "borderColor"
  | "inputBackground"
  | "inputBorder"
  | "secondaryButtonBorderColor"
  | "errorBadgeBorder"
  | "errorBadgeBackground"
  | "error"
  | "signupIcon"
  | "signupBorderColor"
  | "signup"
  | "hover"
  | "lightSecondary"
  | "uriColor";

export const DarkThemeColors: Record<IThemeColor, string> = {
  background: "#141416",
  surface: "#FFFFFF",
  blackWhite: "#FFFFFF",
  secondary: "#9EA3AE",
  primary: "#C91A79",
  placeholder: "#9EA3AE",
  borderColor: "#394150",
  inputBackground: "#394150",
  inputBorder: "#394150",
  secondaryButtonBorderColor: "#394150",
  errorBadgeBorder: "#EF7A85",
  errorBadgeBackground: "#FFD4D8",
  error: "#FF5252 ",
  signupIcon: "#FFFFFF",
  signupBorderColor: "#BDBDBD",
  signup: "#212936",
  hover: "#FFFFFF",
  lightSecondary: "#9EA3AE",
  uriColor: "#CD1B78",
};

export const LightThemeColors: Record<IThemeColor, string> = {
  background: "#F2F2F2",
  surface: "#FFFFFF",
  blackWhite: "#141416",
  secondary: "#6C727F",
  primary: "#C91A79",
  placeholder: "#9EA3AE",
  borderColor: "#F0EFFB",
  inputBackground: "#F7F7FD",
  inputBorder: "#E0DEF7",
  secondaryButtonBorderColor: "#D6DDEB",
  errorBadgeBorder: "#EF7A85",
  errorBadgeBackground: "#FFD4D8",
  error: "#FF0000",
  signupIcon: "#394150",
  signupBorderColor: "#BDBDBD",
  signup: "#F4F4F6",
  hover: "#FFFFFF",
  lightSecondary: "#9EA3AE",
  uriColor: "#CD1B78",
};

export default colors;
