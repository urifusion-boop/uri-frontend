import React, { ReactNode, useCallback } from "react";
import useCustomTheme from "@/hooks/theme.hook";
import styles from "@/styles/Atoms.module.css";
import { Box, Typography } from "@mui/material";
import Spinner from "../loaders/Spinner";

type IButtonMode =
  | "primary"
  | "secondary"
  | "signup"
  | "inverse"
  | "website"
  | "disabled"
  | "error";

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  mode?: IButtonMode;
  icon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  small?: boolean;
  padding?: string;
  textColor?: string;
  textStyles?: string;
}

const CustomButton: React.FC<IProps> = ({
  children,
  icon,
  mode,
  style,
  disabled,
  small,
  loading,
  padding,
  textColor,
  textStyles,
  ...props
}) => {
  const { themeColors, currentTheme } = useCustomTheme();

  const getButtonColor = useCallback(
    (mode: IButtonMode) => {
      switch (mode) {
        case "primary":
          return themeColors.primary;
        case "secondary":
          return currentTheme === "light"
            ? themeColors.background
            : themeColors.inputBackground;
        case "signup":
          return themeColors.signup;
        case "inverse":
          return themeColors.surface;
        case "website":
          return themeColors.inputBackground;
        case "disabled":
          return "#1414164D";
        case "error":
          return "#B01717";
        default:
          return themeColors.primary;
      }
    },
    [currentTheme, themeColors]
  );

  const getBorderColor = useCallback(
    (mode: IButtonMode) => {
      switch (mode) {
        case "primary":
          return themeColors.primary;
        case "secondary":
          return themeColors.secondaryButtonBorderColor;
        case "signup":
          return themeColors.signup;
        case "inverse":
          return themeColors.primary;
        case "website":
          return themeColors.inputBorder;
        case "disabled":
          return "#1414164D";
        case "error":
          return "#B01717";
        default:
          return themeColors.primary;
      }
    },
    [themeColors]
  );

  const getTextColor = useCallback(
    (mode: IButtonMode) => {
      switch (mode) {
        case "primary":
          return "#FFFFFF";
        case "secondary":
          return themeColors.blackWhite;
        case "signup":
          return themeColors.secondary;
        case "inverse":
          return themeColors.primary;
        case "website":
          return themeColors.placeholder;
        case "disabled":
          return "#fff";
        case "error":
          return "#FFFFFF";
        default:
          return "#FFFFFF";
      }
    },
    [themeColors]
  );

  const inActive: boolean = !!disabled || !!loading;

  return (
    <button
      {...props}
      style={{
        backgroundColor: mode ? getButtonColor(mode) : themeColors.primary,
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: `1px solid ${
          mode ? getBorderColor(mode) : themeColors.primary
        }`,
        ...style,
        padding: padding ?? "12px",
      }}
      className={`${styles.customButton} ${props.className}`}
      disabled={inActive}
    >
      {loading ? (
        <Spinner color={mode ? getTextColor(mode) : themeColors.background} />
      ) : (
        <>
          {icon && <Box sx={{ mr: 1 }}>{icon}</Box>}
          <Typography
            fontSize={small ? 12 : 16}
            color={
              mode ? (textColor ?? getTextColor(mode)) : themeColors.blackWhite
            }
            className={textStyles}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
            }}
          >
            {children}
          </Typography>
        </>
      )}
    </button>
  );
};

export default CustomButton;
