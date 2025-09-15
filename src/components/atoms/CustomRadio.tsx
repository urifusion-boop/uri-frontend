import useCustomTheme from "@/hooks/theme.hook";
import { Box, Radio, Checkbox } from "@mui/material";
import React from "react";
import Text from "./CustomText";

interface IProps {
  checked?: boolean;
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => void;
  onClick?: () => void;
  label?: string;
  mr?: number;
  value: string | number | boolean;
  color?: string;
  disabled?: boolean;
  fontSize?: number;
  checkbox?: boolean;
}

const CustomRadio: React.FC<IProps> = ({
  checked,
  onChange,
  onClick,
  label,
  mr,
  value,
  color,
  disabled,
  fontSize,
  checkbox,
}) => {
  const { themeColors } = useCustomTheme();
  return (
    <Box className="d-flex items-center" sx={{ mr: mr ?? 0 }}>
      {checkbox ? (
        <Checkbox
          disabled={disabled ? disabled : false}
          checked={checked}
          onChange={onChange}
          onClick={onClick}
          value={value}
          size={"small"}
          style={{ color: color ? color : themeColors.primary }}
          inputProps={{ "aria-label": "A" }}
        />
      ) : (
        <Radio
          disabled={disabled ? disabled : false}
          checked={checked}
          onChange={onChange}
          onClick={onClick}
          value={value}
          style={{ color: color ? color : themeColors.primary }}
          inputProps={{ "aria-label": "A" }}
          sx={{
            "& .MuiSvgIcon-root": { fontSize: fontSize ?? 16 },
          }}
        />
      )}

      {label && label.trim() && (
        <Text
          size={fontSize ? fontSize : 14}
          weight={500}
          sx={{ whiteSpace: "nowrap" }}
        >
          {label}
        </Text>
      )}
    </Box>
  );
};

export default CustomRadio;
