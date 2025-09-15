import AuthNav from '@/components/atoms/AuthNav';
import LocationProfileSetup from '@/components/atoms/Location';
import ProfileStagesContainer from '@/components/atoms/ProfileStagesContainer';
import ModalContent from '@/components/clients/ModalContent';
import CustomModal from '@/components/modals/CustomModal';
import Wrapper from '@/components/wrappers/Wrapper';
import { useCreativeProfileSetup } from '@/hooks/profile/creative/creativeProfileSetup.hook';
import useCustomTheme from '@/hooks/theme.hook';
import { useModal } from '@/hooks/utils.hook';
import { Box, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import CreativeCategory from './CreativeCategory';
import ProfileDetails from './ProfileDetails';

const CreativesProfileSetup = () => {
  const { themeColors } = useCustomTheme();
  const [stages] = useState(['Location', 'Category', 'Profile Details']);
  const [stage, setStage] = useState(stages[0]);

  const { open, openModal, closeModal, setOpen } = useModal();
  const { formDetails, setFormDetails, onSubmit } = useCreativeProfileSetup();

  useEffect(() => {
    openModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Box
        sx={{
          background: themeColors.background,
          minHeight: '100vh',
          paddingBottom: '100px',
        }}
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
              <Box sx={{ padding: '0px 20px' }}>
                <LocationProfileSetup
                  active={stage === stages[0]}
                  formDetails={formDetails}
                  setFormDetails={setFormDetails}
                  setStage={(index: number) => setStage(stages[index])}
                  showHeader
                  userType="creative"
                  onSubmit={() => {}}
                />
                <CreativeCategory active={stage === stages[1]} formDetails={formDetails} setFormDetails={setFormDetails} setStage={(index: number) => setStage(stages[index])} />
                <ProfileDetails active={stage === stages[2]} onSubmit={onSubmit} formDetails={formDetails} setFormDetails={setFormDetails} setStage={(index: number) => setStage(stages[index])} />
              </Box>
            </Grid>
            <Grid xs={12} md={2} lg={3} item></Grid>
          </Grid>
        </Wrapper>

        <CustomModal width="756px" open={open} setOpen={setOpen} closeOnOverlayClick={false}>
          <ModalContent onClickComplete={() => closeModal()} steps="three" />
        </CustomModal>
      </Box>
    </>
  );
};

export default CreativesProfileSetup;
