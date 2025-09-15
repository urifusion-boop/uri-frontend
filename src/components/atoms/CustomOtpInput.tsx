import useCustomTheme from "@/hooks/theme.hook";
import React from "react";
import OTPInput from "react-otp-input";
import Text, { ErrorText } from "./CustomText";
import { Box } from "@mui/material";

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
  otp: string;
  setOtp:
    | React.Dispatch<React.SetStateAction<string>>
    | ((otp: string) => void);
  numInputs: 4 | 6;
  errorText?: string;
  label?: string;
  description?: string;
}

const CustomOtpInput: React.FC<IProps> = ({
  otp,
  setOtp,
  numInputs,
  label,
  description,
  errorText,
  ...props
}) => {
  const { themeColors } = useCustomTheme();
  return (
    <>
      {label && label.trim().length > 0 && (
        <Text size={14} weight={500} mode="base" sx={{ mb: 1 }}>
          {label}
        </Text>
      )}
      {description && description.trim().length > 0 && (
        <Text
          size={13}
          weight={500}
          mode="base"
          sx={{ mb: 1, fontStyle: "italic" }}
        >
          {description}
        </Text>
      )}
      <Box sx={{ width: "100%" }}>
        <OTPInput
          value={otp}
          onChange={setOtp}
          numInputs={numInputs}
          renderSeparator={<span> </span>}
          shouldAutoFocus
          renderInput={(props) => (
            <input
              {...props}
              style={{
                width: "100%",
                height: "47px",
                borderRadius: "5px",
                backgroundColor: themeColors.inputBackground,
                border: `1px solid ${themeColors.inputBorder}`,
                margin: "0 3px",
                color: themeColors.blackWhite,
                fontSize: "24px",
                textAlign: "center",
                outlineColor: themeColors.primary,
              }}
            />
          )}
          inputStyle={{
            textAlign: "center",
          }}
        />
        {errorText && errorText.trim().length && (
          <ErrorText>{errorText}</ErrorText>
        )}
      </Box>
    </>
  );
};

export default CustomOtpInput;
