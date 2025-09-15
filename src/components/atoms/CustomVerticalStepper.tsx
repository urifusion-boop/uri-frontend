import React from "react";
import { Box } from "@mui/material";
import Text from "./CustomText";
import { ISelectData } from "../../types";

interface IProps {
  active: string;
  steps: ISelectData[];
  onClick: (value: any) => void;
}

const CustomVerticalStepper: React.FC<IProps> = ({
  active,
  steps,
  onClick,
}) => {
  const activeIndex = steps.findIndex(
    (step: ISelectData) => step.value === active
  );

  return (
    <Box sx={{ pt: 3, cursor: "pointer" }}>
      {steps &&
        steps.map((step: ISelectData, index) => (
          <Box
            className="d-flex"
            onClick={() => onClick(String(step.value))}
            sx={{
              padding: "10px 30px 0px 30px",
            }}
            key={index}
          >
            <Text
              size={12}
              weight={700}
              sx={{
                width: "28px",
                height: "28px",
                backgroundColor: activeIndex > index ? "#F48F18" : "#FFF3E5",
                borderRadius: "100px",
                border: activeIndex >= index ? `1px solid #F48F18` : "none",
                boxSizing: "border-box",
                paddingTop: activeIndex >= index ? "4px" : "5px",
                marginRight: "20px",
                color: activeIndex > index ? "white" : "#F48F18",
              }}
              center
            >
              {index + 1}
            </Text>
            <Text size={16} weight={500} sx={{ mb: 2, pt: "1px" }}>
              {step.label}
            </Text>
          </Box>
        ))}
    </Box>
  );
};

export default CustomVerticalStepper;
