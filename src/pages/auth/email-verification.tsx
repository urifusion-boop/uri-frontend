import useCustomTheme from "@/hooks/theme.hook";
import { useEmailVerificationHook } from "@/hooks/auth/emailVerification.hook";
import { Box, Grid, useMediaQuery } from "@mui/material";
import React from "react";
import Text from "@/components/atoms/CustomText";
import CustomButton from "@/components/atoms/CustomButton";
import {
  ResetPasswordIcon,
  EmailConfirmedIcon,
} from "@/components/atoms/Icons";
import CustomOtpInput from "@/components/atoms/CustomOtpInput";
import Badge from "@/components/atoms/ErrorBadge";
import styles from "@/styles/Auth.module.css";
import SeoHead from "../../components/atoms/SeoHead";
import Wrapper from "@/components/wrappers/Wrapper";
import AuthNav from "@/components/atoms/AuthNav";

const EmailVerificationPage = () => {
  const { themeColors } = useCustomTheme();
  const {
    status,
    verifyEmail,
    resendVerificationEmail,
    token,
    setToken,
    loading,
    continueSetup,
  } = useEmailVerificationHook();
  const matches = useMediaQuery("(max-width: 600px)");

  return (
    <>
      <SeoHead title="Verification" />

      <Box
        sx={{ background: themeColors.background, height: "100vh" }}
        className={styles.background}
      >
        <AuthNav />
        <Wrapper>
          <Grid container>
            <Grid item xs={12} md={3} lg={3}></Grid>
            <Grid item xs={12} md={6} lg={6}>
              {status === "verified" && (
                <Box
                  className="d-flex flex-column justify-center"
                  sx={{ height: "80vh", padding: "30px" }}
                >
                  <Box
                    sx={{ mb: 2 }}
                    className="d-flex justify-center auth-vector"
                  >
                    <ResetPasswordIcon />
                  </Box>
                  <Text size={32} weight={700} center>
                    Email Verification
                  </Text>
                  <Text
                    size={matches ? 12 : 16}
                    weight={500}
                    mode="secondary"
                    sx={{ mt: 2 }}
                    center
                  >
                    Enter the six digit code we sent to your email address.If
                    you {"don't"} see the email in your inbox, please check your
                    spam folder.
                  </Text>
                  <Box
                    sx={{ mt: 2 }}
                    className="d-flex justify-center items-center"
                  >
                    <CustomOtpInput
                      numInputs={6}
                      otp={token}
                      setOtp={setToken}
                    />
                  </Box>
                  <Box
                    sx={{ mt: { xs: 2, md: 4 }, width: "100%" }}
                    className="d-flex justify-center items-center"
                  >
                    <CustomButton
                      mode="primary"
                      style={{ marginBottom: "16px" }}
                      onClick={() => verifyEmail(token)}
                      disabled={token.trim().length < 6}
                      loading={loading}
                    >
                      Verify Email
                    </CustomButton>
                  </Box>
                  <Box
                    className="d-flex"
                    sx={{ justifyContent: "center", mt: 1 }}
                  >
                    <Text size={16} weight={700}>
                      {`Didn't get the code?`}
                    </Text>
                    <Text
                      size={16}
                      weight={700}
                      color={themeColors.primary}
                      sx={{ mx: "5px", cursor: "pointer" }}
                      onClick={() => resendVerificationEmail()}
                    >
                      Resend Code
                    </Text>
                  </Box>
                </Box>
              )}
              {status === "confirmed" && (
                <Box
                  className="d-flex flex-column justify-center "
                  sx={{ height: "80vh" }}
                >
                  <Box sx={{ mb: 2 }} className="d-flex justify-center">
                    <EmailConfirmedIcon />
                  </Box>
                  <Text size={32} weight={700} center>
                    Email verified
                  </Text>
                  <Text
                    size={16}
                    weight={500}
                    mode="secondary"
                    sx={{ mt: 2 }}
                    center
                  >
                    Your email has been successfully verified. Click here to
                    login.
                  </Text>
                  <Box
                    sx={{ mt: { xs: 2, md: 4 }, width: "100%" }}
                    className="d-flex justify-center items-center"
                  >
                    <CustomButton
                      mode="primary"
                      style={{ marginBottom: "16px" }}
                      onClick={() => continueSetup()}
                    >
                      Let&apos;s get started
                    </CustomButton>
                  </Box>
                </Box>
              )}
              {status === "notConfirmed" && (
                <Box
                  className="d-flex flex-column justify-center "
                  sx={{ height: "80vh" }}
                >
                  <Box sx={{ mb: 0 }} className="d-flex justify-center">
                    <ResetPasswordIcon />
                  </Box>
                  <Text size={32} weight={700} center>
                    Email verification
                  </Text>
                  <Text
                    size={16}
                    weight={500}
                    mode="secondary"
                    sx={{ mt: 2 }}
                    center
                  >
                    Enter the six digit code we sent to your email address to
                    verify your account
                  </Text>
                  <Box
                    sx={{ mt: 2 }}
                    className="d-flex justify-center items-center"
                  >
                    <CustomOtpInput
                      numInputs={6}
                      otp={token}
                      setOtp={setToken}
                    />
                  </Box>
                  <Box
                    sx={{ mt: { xs: 2, md: 4 }, width: "100%" }}
                    className="d-flex justify-center items-center"
                  >
                    <Badge>
                      Oh no, the code you entered is incorrect, please try
                      again.
                    </Badge>
                  </Box>
                  <Box
                    sx={{ mt: { xs: 2, md: 4 }, width: "100%" }}
                    className="d-flex justify-center items-center"
                  >
                    <CustomButton
                      mode="primary"
                      onClick={() => verifyEmail(token)}
                      loading={loading}
                      disabled={token.trim().length < 6}
                    >
                      Verify Email
                    </CustomButton>
                  </Box>
                  <Box
                    className="d-flex"
                    sx={{ justifyContent: "center", mt: 2 }}
                  >
                    <Text size={16} weight={700}>
                      {`Didn't get the code?`}
                    </Text>
                    <Text
                      size={16}
                      weight={700}
                      color={themeColors.primary}
                      sx={{ mx: "5px", cursor: "pointer" }}
                      onClick={() => resendVerificationEmail()}
                    >
                      Resend Code
                    </Text>
                  </Box>
                </Box>
              )}
            </Grid>
          </Grid>
        </Wrapper>
      </Box>
    </>
  );
};

export default EmailVerificationPage;
