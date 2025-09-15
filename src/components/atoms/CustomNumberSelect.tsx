import { Box, Grid } from "@mui/material";
import React from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import useCustomTheme from "../../hooks/theme.hook";
import CustomButton from "./CustomButton";
import Text from "./CustomText";

interface IProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  height?: number;
}

const CustomNumberSelect: React.FC<IProps> = ({
  value,
  onChange,
  min,
  max,
  height,
}) => {
  const { themeColors } = useCustomTheme();

  return (
    <Box>
      <Grid container columnSpacing={0} rowSpacing={2}>
        <Grid item xs={12} sm={3}>
          <Box height={`${height}px`} mt="4px">
            <CustomButton
              disabled={min ? value <= min : false}
              mode="primary"
              style={{
                height: "100%",
                backgroundColor: "transparent",
                border: `3px solid ${themeColors.primary}`,
                borderRadius: "8px 0px 0px 8px",
              }}
              type="submit"
              data-testid="number-select-button"
              onClick={() =>
                onChange(min ? Math.max(min, value - 1) : value - 1)
              }
            >
              <AiOutlineMinus style={{ color: themeColors.primary }} />
            </CustomButton>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box
            height={`${height}px`}
            mt="4px"
            sx={{
              border: `2px solid ${themeColors.borderColor}`,
              boxSizing: "border-box",
              position: "relative",
            }}
          >
            <Text
              size={16}
              weight={600}
              sx={{
                boxSizing: "border-box",
                position: "absolute",
                top: "50%",
                left: "50%",
                translate: "-50% -50%",
              }}
              color={themeColors.lightSecondary}
              center
            >
              {value}
            </Text>
          </Box>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Box height={`${height}px`} mt="4px">
            <CustomButton
              disabled={max ? value >= max : false}
              mode="primary"
              style={{
                height: "100%",
                backgroundColor: "transparent",
                border: `3px solid ${themeColors.primary}`,
                borderRadius: "0px 8px 8px 0px",
              }}
              type="submit"
              data-testid="number-select-button"
              onClick={() =>
                onChange(max ? Math.min(max, value + 1) : value + 1)
              }
            >
              <AiOutlinePlus style={{ color: themeColors.primary }} />
            </CustomButton>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomNumberSelect;
