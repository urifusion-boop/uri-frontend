import Text from "@/components/atoms/CustomText";
import { Box, Grid } from "@mui/material";
import React, { useState } from "react";
import useCustomTheme from "../../../../hooks/theme.hook";
import { useModal } from "../../../../hooks/utils.hook";
import { AiOutlineClose } from "react-icons/ai";
import { Stage } from "../../../../components/atoms/ProfileStagesContainer";
import CustomModal from "../../../../components/modals/CustomModal";
import { CreativeProfileDto } from "../../../../models/dtos/CreativeProfileDto";
import PersonalDetails from "../edit/PresonalDetails";
import ProfileDetails from "../edit/ProfileDetails";
import Category from "../edit/CreativeCategory";
import UserLocation from "../edit/UserLocation";

interface EditProfileProps {
  profile?: CreativeProfileDto;
  onClick: () => void;
}

const EditCreativeProfile = ({ profile, onClick }: EditProfileProps) => {
  const { themeColors } = useCustomTheme();
  const { open, setOpen, openModal } = useModal();
  const [stages] = useState([
    "Personal Details",
    "Location",
    "Category",
    "Profile Details",
  ]);
  const [currentStage, setCurrentStage] = useState(0);

  return (
    <Box sx={{ padding: "0px 50px" }}>
      <Box className="desktop-only">
        <Box
          className="d-flex items-center justify-center hide-scrollbar"
          mt={4}
          sx={{ overflowX: "scroll" }}
        >
          {stages.slice(0, 4).map((item: string, index: number) => {
            return (
              <Box
                className="pointer"
                key={index}
                onClick={() => setCurrentStage(index)}
              >
                <Stage
                  stage={index + 1}
                  lastStage={index + 1 === stages.length}
                  active={
                    stages.findIndex(
                      (stage: string) => stage === stages[currentStage]
                    ) >= index
                  }
                >
                  {item}
                </Stage>
              </Box>
            );
          })}
        </Box>
      </Box>
      <Box className="mobile-only">
        {stages.slice(0, 4).map((item: string, index: number) => {
          return (
            <Box
              className="pointer"
              key={index}
              onClick={() => setCurrentStage(index)}
              mb={2}
            >
              <Stage
                stage={index + 1}
                lastStage={index + 1 === stages.length}
                active={
                  stages.findIndex(
                    (stage: string) => stage === stages[currentStage]
                  ) >= index
                }
                noArrow
              >
                {item}
              </Stage>
            </Box>
          );
        })}
      </Box>

      <Grid container>
        <Grid xs={12} md={2} lg={3} item></Grid>
        <Grid xs={12} md={8} lg={6} item>
          {currentStage === 0 && (
            <PersonalDetails
              profile={profile}
              openModal={() => openModal()}
              setCurrentStage={setCurrentStage}
            />
          )}
          {currentStage === 1 && (
            <UserLocation
              profile={profile}
              openModal={() => openModal()}
              setCurrentStage={setCurrentStage}
            />
          )}
          {currentStage === 2 && (
            <Category
              profile={profile}
              openModal={() => openModal()}
              setCurrentStage={setCurrentStage}
            />
          )}
          {currentStage === 3 && (
            <ProfileDetails
              profile={profile}
              openModal={() => {
                openModal();
                setTimeout(() => {
                  setOpen(false);
                }, 1500);
              }}
              setCurrentStage={setCurrentStage}
              onClick={onClick}
            />
          )}
        </Grid>
        <Grid xs={12} md={2} lg={3} item></Grid>
      </Grid>

      <CustomModal
        width="756px"
        open={open}
        setOpen={setOpen}
        closeOnOverlayClick={true}
      >
        <Box
          sx={{
            width: "20px",
            height: "20px",
            backgroundColor: themeColors.borderColor,
            borderRadius: "20px",
            position: "absolute",
            top: "30px",
            right: "30px",
            cursor: "pointer",
          }}
          onClick={() => setOpen(false)}
        >
          <AiOutlineClose
            style={{
              color: themeColors.blackWhite,
              margin: "2px",
              width: "15px",
              height: "15px",
            }}
          />
        </Box>
        <img
          src="/assets/icons/send-icon-primary.svg"
          alt="image"
          width={70}
          height={70}
          style={{ marginBottom: "20px" }}
        />
        <Text size={24} weight={600}>
          Successfully updated your profile!
        </Text>
      </CustomModal>
    </Box>
  );
};

export default EditCreativeProfile;
