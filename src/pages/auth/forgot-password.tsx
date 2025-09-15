import useCustomTheme from "@/hooks/theme.hook";
import { Box, Grid } from "@mui/material";
import React from "react";
import {
  ForgotPasswordValue,
  useForgotPasswordHook,
} from "@/hooks/auth/forgotPassword.hook";
import styles from "@/styles/Auth.module.css";
import Text from "@/components/atoms/CustomText";
import InputField from "@/components/atoms/Input";
import CustomButton from "@/components/atoms/CustomButton";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordIcon } from "@/components/atoms/Icons";
import SeoHead from "../../components/atoms/SeoHead";
import Wrapper from "@/components/wrappers/Wrapper";
import AuthNav from "@/components/atoms/AuthNav";

const ForgotPasswordPage = () => {
  const { themeColors } = useCustomTheme();
  const { onSubmit, ForgotPasswordSchema, loading } = useForgotPasswordHook();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValue>({
    mode: "onBlur",
    resolver: zodResolver(ForgotPasswordSchema),
  });

  return (
    <>
      <SeoHead title="Forgot Password" />

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
                className="d-flex flex-column justify-center"
                sx={{ height: "80vh", padding: "30px" }}
              >
                <Box
                  sx={{ mb: 2 }}
                  className="d-flex justify-center auth-vector"
                >
                  <ForgotPasswordIcon />
                </Box>
                <Text size={32} weight={700} center>
                  Forgot Password
                </Text>
                <Text
                  size={16}
                  weight={500}
                  mode="secondary"
                  sx={{ mt: 2 }}
                  center
                >
                  Enter the email address associated with your account and we’ll
                  send you a link to reset your password
                </Text>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Box sx={{ mt: 2 }}>
                    <Controller
                      control={control}
                      name="email"
                      render={({ field: { onChange, value, onBlur } }) => (
                        <InputField
                          label="Email"
                          type="email"
                          value={value}
                          onChange={onChange}
                          onBlur={onBlur}
                          errorText={errors?.email?.message}
                        />
                      )}
                    />
                  </Box>
                  <Box sx={{ mt: { xs: 2, md: 4 } }}>
                    <CustomButton
                      mode="primary"
                      style={{ marginBottom: "16px" }}
                      type="submit"
                      loading={loading}
                    >
                      Continue
                    </CustomButton>
                  </Box>
                </form>
              </Box>
            </Grid>
            <Grid item xs={12} md={3} lg={3}></Grid>
          </Grid>
        </Wrapper>
      </Box>
    </>
  );
};

export default ForgotPasswordPage;
