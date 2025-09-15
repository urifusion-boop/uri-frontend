import React from "react";
import { Box, Grid } from "@mui/material";
import Text from "@/components/atoms/CustomText";
import useCustomTheme from "@/hooks/theme.hook";
import { useRouter } from "next/router";
import { EmailConfirmedIcon } from "@/components/atoms/Icons";
import styles from "@/styles/Auth.module.css";
import CustomButton from "@/components/atoms/CustomButton";
import SeoHead from "../../components/atoms/SeoHead";
import Wrapper from "@/components/wrappers/Wrapper";
import AuthNav from "@/components/atoms/AuthNav";

const PasswordResetSuccessfulPage = () => {
  const { themeColors } = useCustomTheme();
  const router = useRouter();

  return (
    <>
      <SeoHead title="Reset Password" />
      <Box
        sx={{ background: themeColors.background, height: "100vh" }}
        className={styles.background}
      >
        <AuthNav />
        <Wrapper>
          <Grid container>
            <Grid item xs={12} md={3} lg={3}></Grid>
            <Grid item xs={12} md={6} lg={6}>
              <Box
                className="d-flex flex-column justify-center "
                sx={{ height: "80vh", padding: "30px" }}
              >
                <Box
                  sx={{ mb: 2 }}
                  className="d-flex justify-center auth-vector"
                >
                  <EmailConfirmedIcon />
                </Box>
                <Text size={32} weight={700} center>
                  Password reset
                </Text>
                <Text
                  size={16}
                  weight={500}
                  mode="secondary"
                  sx={{ mt: 2 }}
                  center
                >
                  Your password has been successfully reset. Click here to login
                </Text>
                <Box
                  sx={{ mt: { xs: 2, md: 4 }, width: "100%" }}
                  className="d-flex justify-center items-center"
                >
                  <CustomButton
                    mode="primary"
                    style={{ marginBottom: "16px" }}
                    onClick={() => router.push("/login")}
                  >
                    Login to Continue
                  </CustomButton>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={3} lg={3}></Grid>
          </Grid>
        </Wrapper>
      </Box>
    </>
  );
};

export default PasswordResetSuccessfulPage;
