import useCustomTheme from "@/hooks/theme.hook";
import styles from "@/styles/Atoms.module.css";
import { Box } from "@mui/material";
import React, { ReactNode } from "react";
import { ErrorIcon } from "./Icons";
import Text from "./CustomText";

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const Badge: React.FC<IProps> = ({ children, style, ...props }) => {
  const { themeColors } = useCustomTheme();

  return (
    <div
      {...props}
      style={{
        backgroundColor: themeColors.errorBadgeBackground,
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        border: `1px solid ${themeColors.errorBadgeBorder}`,
        ...style,
      }}
      className={styles.errorButton}
    >
      <Box sx={{ mr: 1 }}>
        <ErrorIcon />
      </Box>
      <Text size={12} weight={500} mode="error" sx={{ textAlign: "left" }}>
        {children}
      </Text>
    </div>
  );
};

export default Badge;
