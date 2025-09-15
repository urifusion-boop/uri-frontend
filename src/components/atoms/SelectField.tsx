import useCustomTheme from "@/hooks/theme.hook";
import { ISelectData } from "@/types";
import { Box } from "@mui/material";
import React from "react";
import { FieldError } from "react-hook-form";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import Text, { ErrorText } from "./CustomText";

type ValueType = ISelectData | null;

interface IProps {
  label?: string;
  mt?: number;
  errorText?: string;
  options: ISelectData[];
  value?: ValueType;
  onChange: (value: ValueType) => void;
  placeholder: string;
  isLoading?: boolean;
  multiSelect?: boolean;
  defaultValue?: ValueType;
  error?: FieldError;
  height?: string;
  noBg?: boolean;
}

const SelectField: React.FC<IProps> = ({
  mt,
  errorText,
  options,
  label,
  value,
  onChange,
  placeholder,
  isLoading,
  defaultValue,
  multiSelect,
  error,
  height,
  noBg,
}) => {
  const { themeColors, currentTheme } = useCustomTheme();
  const animatedComponents = makeAnimated();
  return (
    <Box sx={{ mt: mt || 0 }}>
      {label && label.trim().length > 0 && (
        <Text size={14} weight={500} mode="base" sx={{ mb: 1 }}>
          {label}
        </Text>
      )}

      <Select
        closeMenuOnSelect={!multiSelect}
        components={animatedComponents}
        isMulti={multiSelect}
        options={options}
        // @ts-ignore
        onChange={onChange}
        defaultValue={defaultValue}
        value={value}
        placeholder={placeholder}
        styles={{
          control: (baseStyles) => ({
            ...baseStyles,
            background: noBg ? "#fff" : themeColors.inputBackground,
            border: `1px solid ${error ? "red" : themeColors.inputBorder}`,
            color: themeColors.blackWhite,
            height: height || "56px",
          }),
          placeholder: (baseStyles) => {
            return {
              ...baseStyles,
              color: themeColors.placeholder,
              fontSize: "14px",
            };
          },
          // Style for the dropdown indicator (arrow)
          dropdownIndicator: (provided) => ({
            ...provided,
            color: themeColors.secondary, // Change this to the desired font color
          }),
          // Style for the selected option label
          singleValue: (provided) => ({
            ...provided,
            color: themeColors.blackWhite, // Change this to the desired font color
          }),
          // Style for the dropdown menu
          menu: (provided) => ({
            ...provided,
            color: themeColors.secondary, // Change this to the desired font color for the options in the dropdown
            backgroundColor: themeColors.background, // Change this to the desired background color for the dropdown
            boxShadow: `0px 2px 4px ${
              currentTheme === "light"
                ? "rgba(0, 0, 0, 0.1)"
                : "rgba(255, 255, 255, 0.1)"
            } `,
          }),

          // Style for the menu list (the container of the options)
          menuList: (provided) => ({
            ...provided,
            color: themeColors.secondary, // Change this to the desired font color for the options in the dropdown
            backgroundColor: themeColors.background, // Change this to the desired background color for the dropdown
            boxShadow: `0px 2px 4px ${
              currentTheme === "light"
                ? "rgba(0, 0, 0, 0.1)"
                : "rgba(255, 255, 255, 0.1)"
            } `,
          }),
        }}
        isLoading={isLoading}
      />

      {errorText && errorText.trim().length && (
        <ErrorText>{errorText}</ErrorText>
      )}
    </Box>
  );
};

export default SelectField;
