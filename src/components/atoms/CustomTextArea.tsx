import useCustomTheme from "@/hooks/theme.hook";
import { Box } from "@mui/material";
import React, { ReactNode } from "react";
import Text, { ErrorText } from "./CustomText";

interface IProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  icon?: ReactNode;
  mt?: number;
  errorText?: string;
}
const TextAreaField: React.FC<IProps> = ({
  label,
  icon,
  mt,
  rows,
  errorText,
  ...rest
}) => {
  const { themeColors } = useCustomTheme();
  return (
    <Box sx={{ mt: mt ?? 0, height: "100%" }}>
      {label && label.trim().length > 0 && (
        <Text size={14} weight={500} mode="base" sx={{ mb: 1 }}>
          {label}
        </Text>
      )}
      <Box
        sx={{
          backgroundColor: themeColors.inputBackground,
          border: `1px solid ${themeColors.inputBorder}`,
        }}
      >
        <textarea
          {...rest}
          style={{
            background: themeColors.inputBackground,
            color: themeColors.blackWhite,
            border: "none",
            padding: 20,
            height: "100%",
            width: "100%",
            boxSizing: "border-box",
          }}
          rows={rows ?? 7}
        />

        {icon}
      </Box>
      {errorText && <ErrorText>{errorText}</ErrorText>}
    </Box>
  );
};

export default TextAreaField;
