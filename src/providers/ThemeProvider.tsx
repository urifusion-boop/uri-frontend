import React from "react";
import Spinner from "@/components/loaders/Spinner";
import {
  DarkThemeColors,
  IThemeColor,
  LightThemeColors,
} from "@/configs/colors.config";
import { STORE_KEYS } from "@/configs/store.config";
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from "@/utils/localStorage.util";
import Sleep from "@/utils/sleep.util";
import {
  IThemeContext,
  IThemeName,
  IThemeProviderProps,
  IThemeSwitchWaitProps,
} from "./interfaces";
import { Box } from "@mui/material";
import Text from "@/components/atoms/CustomText";

export const ThemeContext = React.createContext<IThemeContext>({
  currentTheme: "light",
  changeTheme: () => {},
  themeColors: LightThemeColors,
});

/**
 * This component serves as the theme provider and sets the interface for
 * switching and getting the selected theme.
 * @returns React.ReactElement
 */
const ThemeProvider: IThemeProviderProps = function ThemProvider({ children }) {
  const [theme, setTheme] = React.useState<IThemeName>("light");
  const [isPending, setIsPending] = React.useState<boolean>(true);
  const [colors, setColors] =
    React.useState<Record<IThemeColor, string>>(LightThemeColors);
  /**
   * This method is used to change the current theme being used within the
   * mobile app.
   * @param {IThemeName} name
   */
  const changeTheme = React.useCallback(async function changeTheme(
    name: IThemeName
  ) {
    // toggle pending mode on
    setIsPending(true);
    // persist new them
    setLocalStorageItem(STORE_KEYS.THEME, name);
    // update theme in state
    await Sleep(500);
    // set theme colors
    //setColors(name === "light" ? LightThemeColors : DarkThemeColors);
    setColors(LightThemeColors);
    // set current theme
    setTheme(name);
    // toggle pending mode off
    setIsPending(false);
  }, []);

  /**
   * This method is used to set the initial theme, this will get the selected
   * theme from the async store.
   */
  const setInitialTheme = React.useCallback(
    async function setInitialTheme() {
      // check the browser color mode
      const prefersDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const persistedTheme = getLocalStorageItem<IThemeName>(STORE_KEYS.THEME);
      // change theme to the persisted theme
      changeTheme(
        persistedTheme === "light"
          ? "light"
          : prefersDarkMode
            ? "dark"
            : "light"
      );
    },
    [changeTheme]
  );

  // handle component did mount
  React.useEffect(() => {
    setInitialTheme();
    // handle component will unmount
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setInitialTheme]);

  // render the app
  return (
    <ThemeContext.Provider
      value={{
        currentTheme: theme,
        changeTheme: changeTheme,
        themeColors: colors,
      }}
    >
      {!isPending ? (
        <>{children}</>
      ) : (
        <ThemeSwitchWait
          backgroundColor={colors.background}
          textColor={colors.blackWhite}
          spinnerColor={colors.blackWhite}
        />
      )}
    </ThemeContext.Provider>
  );
};

/**
 * This component replaces the app and is show to the user while the
 * application theme is being selected.
 * @param {IThemeSwitchWaitProps} props
 * @returns React.ReactElement
 */
const ThemeSwitchWait: React.FC<IThemeSwitchWaitProps> =
  function ThemeSwitchWait({}: IThemeSwitchWaitProps) {
    const [colors] =
      React.useState<Record<IThemeColor, string>>(DarkThemeColors);
    return (
      <Box
        sx={{
          display: "flex",
          position: "fixed",
          width: "100%",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: colors.background,
        }}
      >
        <Spinner color={colors.blackWhite} />
        <Text size={18} color={colors.blackWhite} weight={500}>
          Loading...
        </Text>
      </Box>
    );
  };

// export ThemeProvider component as the default module
export default ThemeProvider;
