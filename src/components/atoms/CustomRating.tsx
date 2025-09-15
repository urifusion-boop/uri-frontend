import { Rating, styled } from "@mui/material";
import React from "react";
import useCustomTheme from "../../hooks/theme.hook";

interface IProps {
  defaultValue?: number;
  value: number;
  onChange: (value: number) => void;
  color?: string;
}

const CustomRating: React.FC<IProps> = ({
  defaultValue,
  value,
  onChange,
  color,
}) => {
  const { themeColors } = useCustomTheme();

  const CustomRating = styled(Rating)({
    "& .MuiRating-iconFilled": {
      color: color ? color : themeColors.primary,
    },
    "& .MuiRating-iconHover": {
      color: color ? color : themeColors.primary,
    },
  });

  return (
    <CustomRating
      name="rating"
      defaultValue={defaultValue ? defaultValue : 1}
      value={value}
      onChange={(event, newValue) => {
        onChange(typeof newValue === "number" ? newValue : 1);
      }}
    />
  );
};

export default CustomRating;
