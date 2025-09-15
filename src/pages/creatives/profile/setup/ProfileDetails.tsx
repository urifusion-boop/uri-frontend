import React, { useState } from "react";
import { Box } from "@mui/material";
import ModelProfileDetails from "../components/ModelProfileDetails";
import MoreDetails from "../../../profile/setup/MoreDetails";
import { CreativeProfileFormDetails } from "@/hooks/profile/creative/creativeProfileSetup.hook";

interface IProps {
  active: boolean;
  onSubmit: () => void;
  formDetails: CreativeProfileFormDetails;
  setFormDetails: (data: CreativeProfileFormDetails) => void;
  setStage: (index: number) => void;
}

const ProfileDetails: React.FC<IProps> = ({
  onSubmit,
  active,
  formDetails,
  setFormDetails,
  setStage,
}) => {
  const [subStage, setSubStage] = useState(1);

  return active ? (
    <Box sx={{ mt: 3 }}>
      <ModelProfileDetails
        active={subStage === 1}
        formDetails={formDetails}
        setFormDetails={setFormDetails}
        setStage={(index: number) => setStage(index)}
        setSubStage={(index: number) => setSubStage(index)}
      />
      <MoreDetails
        onSubmit={onSubmit}
        active={subStage === 2}
        formDetails={formDetails}
        setFormDetails={setFormDetails}
        setSubStage={(index: number) => setSubStage(index)}
      />
    </Box>
  ) : null;
};

export default ProfileDetails;
