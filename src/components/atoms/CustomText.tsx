import useTheme from "@/hooks/theme.hook";
import { SxProps, Typography } from "@mui/material";
import React, { ReactNode, useCallback } from "react";

type IFontColor =
  | "primary"
  | "secondary"
  | "info"
  | "error"
  | "base"
  | "signup"
  | "inverse"
  | "hover"
  | "lightSecondary";

interface IProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
  color?: string;
  weight: 300 | 400 | 500 | 600 | 700 | 800 | 900;
  size: number;
  mode?: IFontColor;
  sx?: SxProps;
  center?: boolean;
  component?: "span";
}

const CustomText: React.FC<IProps> = ({
  children,
  weight,
  size,
  mode,
  color,
  sx,
  style,
  center,
  component,
  ...props
}) => {
  const { themeColors } = useTheme();

  const renderColor = useCallback(
    (mode: IFontColor) => {
      switch (mode) {
        case "primary":
          return themeColors.primary;
        case "secondary":
          return themeColors.secondary;
        case "base":
          return themeColors.blackWhite;
        case "hover":
          return themeColors.hover;
        case "signup":
          return themeColors.placeholder;
        case "inverse":
          return themeColors.background;
        case "error":
          return themeColors.error;
        case "lightSecondary":
          return themeColors.lightSecondary;
        default:
          return themeColors.blackWhite;
      }
    },
    [themeColors]
  );
  return (
    <Typography
      {...props}
      component={component ? component : "p"}
      sx={{
        fontWeight: weight,
        fontSize: size,
        color: color
          ? color
          : mode
            ? renderColor(mode)
            : themeColors.blackWhite,
        ...sx,
        textAlign: center ? "center" : "left",
      }}
      style={{ ...style }}
    >
      {children}
    </Typography>
  );
};

interface IErrorTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

export const ErrorText: React.FC<IErrorTextProps> = ({ children }) => {
  return (
    <CustomText mode="error" size={12} weight={400}>
      {children}
    </CustomText>
  );
};

export default CustomText;
