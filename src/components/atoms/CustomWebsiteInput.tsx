import { Box } from "@mui/material";
import React, { ReactNode } from "react";
import styles from "@/styles/Atoms.module.css";
import useCustomTheme from "@/hooks/theme.hook";
import Text, { ErrorText } from "./CustomText";
import CustomButton from "./CustomButton";

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
  mt?: number;
  errorText?: string;
}

const CustomWebsiteLink: React.FC<IProps> = ({
  label,
  icon,
  mt,
  errorText,
  ...rest
}) => {
  const { themeColors } = useCustomTheme();
  return (
    <Box sx={{ mt: mt ?? 0 }}>
      {label && label.trim().length > 0 && (
        <Text size={14} weight={500} mode="base" sx={{ mb: 1 }}>
          {label}
        </Text>
      )}
      <Box
        sx={{
          backgroundColor: "white",
          border: `1px solid ${themeColors.inputBorder}`,
        }}
        className={styles.inputContainer}
      >
        <Box
          sx={{
            background: "white",
            color: themeColors.blackWhite,
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            py: 1,
          }}
        >
          <Box sx={{ width: "25%" }}>
            <CustomButton mode="website" disabled>
              http://
            </CustomButton>
          </Box>
        </Box>
        <input
          {...rest}
          style={{
            background: "none",
          }}
        />

        {icon}
      </Box>
      {errorText && <ErrorText>{errorText}</ErrorText>}
    </Box>
  );
};

export default CustomWebsiteLink;
