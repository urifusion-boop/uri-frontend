import AuthNav from '@/components/atoms/AuthNav';
import CustomButton from '@/components/atoms/CustomButton';
import CustomOtpInput from '@/components/atoms/CustomOtpInput';
import Text from '@/components/atoms/CustomText';
import Badge from '@/components/atoms/ErrorBadge';
import { EmailConfirmedIcon, ResetPasswordIcon } from '@/components/atoms/Icons';
import Wrapper from '@/components/wrappers/Wrapper';
import useCustomTheme from '@/hooks/theme.hook';
import styles from '@/styles/Auth.module.css';
import { Box, Grid, useMediaQuery } from '@mui/material';
import SeoHead from '../../components/atoms/SeoHead';
import { useLoginConfirmationHook } from '../../hooks/admin/loginConfirmation.hook';

const LoginConfirmationPage = () => {
  const { themeColors } = useCustomTheme();
  const { status, confirmLogin, token, setToken, loading, continueLogin } = useLoginConfirmationHook();
  const matches = useMediaQuery('(max-width: 600px)');

  return (
    <>
      <SeoHead title="Login Confirmation" />

      <Box sx={{ background: themeColors.background, height: '100vh' }} className={styles.background}>
        <AuthNav />
        <Wrapper>
          <Grid container>
            <Grid item xs={12} md={3} lg={3}></Grid>
            <Grid item xs={12} md={6} lg={6}>
              {status === 'verified' && (
                <Box className="d-flex flex-column justify-center" sx={{ height: '80vh', padding: '30px' }}>
                  <Box sx={{ mb: 2 }} className="d-flex justify-center auth-vector">
                    <ResetPasswordIcon />
                  </Box>
                  <Text size={32} weight={700} center>
                    Admin Login Confirmation
                  </Text>
                  <Text size={matches ? 12 : 16} weight={500} mode="secondary" sx={{ mt: 2 }} center>
                    A login confirmation code is required for ADMIN accounts. Contact the Super Admin for more details.
                  </Text>
                  <Box sx={{ mt: 2 }} className="d-flex justify-center items-center">
                    <CustomOtpInput numInputs={6} otp={token} setOtp={setToken} />
                  </Box>
                  <Box sx={{ mt: { xs: 2, md: 4 }, width: '100%' }} className="d-flex justify-center items-center">
                    <CustomButton mode="primary" style={{ marginBottom: '16px' }} onClick={() => confirmLogin(token)} disabled={token.trim().length < 6} loading={loading}>
                      Confirm Login
                    </CustomButton>
                  </Box>
                </Box>
              )}
              {status === 'confirmed' && (
                <Box className="d-flex flex-column justify-center " sx={{ height: '80vh' }}>
                  <Box sx={{ mb: 2 }} className="d-flex justify-center">
                    <EmailConfirmedIcon />
                  </Box>
                  <Text size={32} weight={700} center>
                    Login Confirmed
                  </Text>
                  <Text size={16} weight={500} mode="secondary" sx={{ mt: 2 }} center>
                    Your login has been successfully confirmed. Click here to continue.
                  </Text>
                  <Box sx={{ mt: { xs: 2, md: 4 }, width: '100%' }} className="d-flex justify-center items-center">
                    <CustomButton mode="primary" style={{ marginBottom: '16px' }} onClick={() => continueLogin()}>
                      Continue
                    </CustomButton>
                  </Box>
                </Box>
              )}
              {status === 'notConfirmed' && (
                <Box className="d-flex flex-column justify-center " sx={{ height: '80vh' }}>
                  <Box sx={{ mb: 0 }} className="d-flex justify-center">
                    <ResetPasswordIcon />
                  </Box>
                  <Text size={32} weight={700} center>
                    Admin Login Confirmation
                  </Text>
                  <Text size={16} weight={500} mode="secondary" sx={{ mt: 2 }} center>
                    A login confirmation code is required for ADMIN accounts. Contact the Super Admin for more details.
                  </Text>
                  <Box sx={{ mt: 2 }} className="d-flex justify-center items-center">
                    <CustomOtpInput numInputs={6} otp={token} setOtp={setToken} />
                  </Box>
                  <Box sx={{ mt: { xs: 2, md: 4 }, width: '100%' }} className="d-flex justify-center items-center">
                    <Badge>Oh no, the code you entered is incorrect, please try again.</Badge>
                  </Box>
                  <Box sx={{ mt: { xs: 2, md: 4 }, width: '100%' }} className="d-flex justify-center items-center">
                    <CustomButton mode="primary" onClick={() => confirmLogin(token)} loading={loading} disabled={token.trim().length < 6}>
                      Confirm Login
                    </CustomButton>
                  </Box>
                  {/* <Box className="d-flex" sx={{justifyContent: "center", mt: 2}}>
                    <Text size={16} weight={700}>
                      {`Didn't get the code?`}
                    </Text>
                    <Text 
                      size={16} 
                      weight={700} 
                      color={themeColors.primary} 
                      sx={{mx: "5px", cursor: "pointer"}}
                      onClick={() => resendVerificationEmail()}
                    >
                      Resend Code
                    </Text>
                  </Box> */}
                </Box>
              )}
            </Grid>
            <Grid item xs={12} md={3} lg={3}></Grid>
          </Grid>
        </Wrapper>
      </Box>
    </>
  );
};

export default LoginConfirmationPage;
