import CustomButton from "@/components/atoms/CustomButton";
import CustomRadio from "@/components/atoms/CustomRadio";
import CustomText from "@/components/atoms/CustomText";
import { creativeTypes } from "@/data/creatives";
import { CreativeProfileFormDetails } from "@/hooks/profile/creative/creativeProfileSetup.hook";
import { Box, Grid } from "@mui/material";
import React from "react";

interface IProps {
  active: boolean;
  formDetails: CreativeProfileFormDetails;
  setFormDetails: (data: CreativeProfileFormDetails) => void;
  setStage: (index: number) => void;
}

const CreativeCategory: React.FC<IProps> = ({
  active,
  formDetails,
  setFormDetails,
  setStage,
}) => {
  const removeElement = (array: any[], index: number) => {
    const arrayData = array;
    array.splice(index, 1);
    return arrayData;
  };

  return active ? (
    <>
      <Box sx={{ mt: 2 }}>
        <CustomText size={20} weight={700}>
          Select your creative type
        </CustomText>
        <CustomText size={16} mode="secondary" weight={400}>
          Please select your area of expertise
        </CustomText>
      </Box>
      <Box>
        {creativeTypes.map((type: any, index: number) => (
          <Box key={index}>
            <CustomRadio
              label={type?.label}
              checked={formDetails.creativeCategories.includes(type.value)}
              onChange={(e) => {
                setFormDetails({
                  ...formDetails,
                  creativeCategories: e.target.value
                    ? formDetails.creativeCategories.concat(type.value)
                    : removeElement(
                        formDetails.creativeCategories,
                        formDetails.creativeCategories.findIndex(type.value)
                      ),
                });
              }}
              value={type.value}
            />
          </Box>
        ))}
      </Box>
      <Grid container spacing={2} sx={{ mt: 5 }}>
        <Grid item xs={6}>
          <CustomButton mode="inverse" onClick={() => setStage(1)}>
            Back
          </CustomButton>
        </Grid>
        <Grid item xs={6}>
          <CustomButton mode="primary" onClick={() => setStage(2)}>
            Continue
          </CustomButton>
        </Grid>
      </Grid>
    </>
  ) : null;
};

export default CreativeCategory;
