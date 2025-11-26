import useCustomTheme from "@/hooks/theme.hook";
import { ISelectData } from "@/types";
import { Box } from "@mui/material";
import React from "react";
import { FieldError } from "react-hook-form";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import Text, { ErrorText } from "./CustomText";

type ValueType = ISelectData | ISelectData[] | null;

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
        onChange={(newValue) => {
          // Cast to our ValueType for proper type handling
          onChange(newValue as ValueType);
        }}
        defaultValue={defaultValue}
        value={value}
        placeholder={placeholder}
        styles={{
          control: (baseStyles) => ({
            ...baseStyles,
            background: noBg ? "#fff" : themeColors.inputBackground,
            border: `1px solid ${error ? "red" : themeColors.inputBorder}`,
            color: themeColors.blackWhite,
            minHeight: height || "56px",
            height: "auto",
          }),
          valueContainer: (baseStyles) => ({
            ...baseStyles,
            padding: "8px",
            maxHeight: multiSelect ? "120px" : "auto",
            overflowY: multiSelect ? "auto" : "visible",
            flexWrap: "wrap",
            gap: "4px",
          }),
          multiValue: (baseStyles) => ({
            ...baseStyles,
            backgroundColor: themeColors.primary || "#CD1B78",
            borderRadius: "6px",
            padding: "2px 4px",
            margin: "2px",
          }),
          multiValueLabel: (baseStyles) => ({
            ...baseStyles,
            color: "#fff",
            fontSize: "13px",
            fontWeight: 500,
            padding: "2px 6px",
          }),
          multiValueRemove: (baseStyles) => ({
            ...baseStyles,
            color: "#fff",
            cursor: "pointer",
            ":hover": {
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              color: "#fff",
            },
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
            color: themeColors.secondary,
          }),
          // Style for the selected option label
          singleValue: (provided) => ({
            ...provided,
            color: themeColors.blackWhite,
          }),
          // Style for the dropdown menu
          menu: (provided) => ({
            ...provided,
            color: themeColors.secondary,
            backgroundColor: themeColors.background,
            boxShadow: `0px 2px 4px ${
              currentTheme === "light"
                ? "rgba(0, 0, 0, 0.1)"
                : "rgba(255, 255, 255, 0.1)"
            } `,
          }),

          // Style for the menu list (the container of the options)
          menuList: (provided) => ({
            ...provided,
            color: themeColors.secondary,
            backgroundColor: themeColors.background,
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
