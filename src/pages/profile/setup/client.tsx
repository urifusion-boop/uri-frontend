import useCustomTheme from "@/hooks/theme.hook";
import { Box, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useClientProfileSetupHook } from "@/hooks/profile/client/clientProfileSetup.hook";
import CustomModal from "@/components/modals/CustomModal";
import { useModal } from "@/hooks/utils.hook";
import AuthNav from "@/components/atoms/AuthNav";
import LocationProfileSetup from "@/components/atoms/Location";
import ProceedModalContent from "@/components/atoms/ProceedModalContent";
import ProfileStagesContainer from "@/components/atoms/ProfileStagesContainer";
import Wrapper from "@/components/wrappers/Wrapper";
import BusinessDetailsForm from "@/components/clients/BusinessDetailsForm";

const ClientProfileSetup = () => {
  const { themeColors } = useCustomTheme();
  const [stages] = useState(["Business Details", "Location"]);
  const { open, openModal, closeModal, setOpen } = useModal();
  const [stage, setStage] = useState(stages[0]);
  const { formDetails, setFormDetails, createUserProfile } =
    useClientProfileSetupHook();

  useEffect(() => {
    openModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      sx={{ background: themeColors.background, minHeight: "100vh" }}
      // className={styles.background}
    >
      <AuthNav />

      <Box>
        <ProfileStagesContainer stages={stages} currentStage={stage} />
      </Box>
      <Wrapper>
        <Grid container>
          <Grid xs={12} md={2} lg={3} item></Grid>
          <Grid xs={12} md={8} lg={6} item>
            <Box sx={{ padding: "0px 20px" }}>
              <BusinessDetailsForm
                active={stage === stages[0]}
                formDetails={formDetails}
                setFormDetails={setFormDetails}
                setStage={(index: number) => setStage(stages[index])}
              />
              <LocationProfileSetup
                active={stage === stages[1]}
                formDetails={formDetails}
                setFormDetails={setFormDetails}
                setStage={(index: number) => setStage(stages[index])}
                showHeader
                userType="client"
                onSubmit={createUserProfile}
              />
              {/* <ServicesNeeded
                active={stage === stages[0]}
                gotoPreviousStage={gotoPreviousStage}
                // gotoNextStage={() => router.push(dashboardRoutes.dashboardHome)}
                gotoNextStage={({ servicesNeeded }) => {
                  setFormDetails({
                    ...formDetails,
                    servicesNeeded,
                  });
                  createUserProfile();
                }}
              /> */}
            </Box>
          </Grid>
          <Grid xs={12} md={2} lg={3} item></Grid>
        </Grid>
      </Wrapper>

      <CustomModal
        width="756px"
        open={open}
        setOpen={setOpen}
        closeOnOverlayClick={false}
      >
        <ProceedModalContent onClickComplete={() => closeModal()} steps="two" />
      </CustomModal>
    </Box>
  );
};

export default ClientProfileSetup;
