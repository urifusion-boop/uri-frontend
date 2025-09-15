import useCustomTheme from "@/hooks/theme.hook";
import { Box, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import styles from "@/styles/Auth.module.css";
import Text from "@/components/atoms/CustomText";
import InputField from "@/components/atoms/Input";
import CustomButton from "@/components/atoms/CustomButton";
import { ForgotPasswordIcon } from "@/components/atoms/Icons";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToggle } from "@/hooks/utils.hook";
import { containsNumber, containsSymbol } from "@/configs/rules.config";
import CustomOtpInput from "@/components/atoms/CustomOtpInput";
import CustomRadio from "@/components/atoms/CustomRadio";
import { useResetPasswordHook } from "@/hooks/auth/resetPassword.hook";
import { ResetPasswordFormValues } from "@/types";
import SeoHead from "../../components/atoms/SeoHead";
import Spinner from "@/components/loaders/Spinner";
import Wrapper from "@/components/wrappers/Wrapper";
import AuthNav from "@/components/atoms/AuthNav";

const ResetPasswordPage = () => {
  const { themeColors } = useCustomTheme();

  const { show, toggleShow } = useToggle();
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    ResetPasswordSchema,
    loading,
    onSubmit,
    onResendCode,
    resendingCode,
    seconds,
    setSeconds,
  } = useResetPasswordHook();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormValues>({
    mode: "onBlur",
    resolver: zodResolver(ResetPasswordSchema),
  });

  const password = watch("password");

  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  useEffect(() => {
    if (seconds > 0) {
      const timerId = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);

      return () => clearInterval(timerId);
    }
  }, [seconds, setSeconds]);

  return (
    <>
      <SeoHead title="Reset Password" />

      <Box
        sx={{ background: themeColors.background }}
        className={styles.background}
      >
        <AuthNav />
        <Wrapper>
          <Grid container>
            <Grid item xs={12} md={3} lg={3}></Grid>
            <Grid item xs={12} md={6} lg={6}>
              <Box
                className="d-flex flex-column justify-center "
                sx={{ height: "115vh", padding: "30px" }}
              >
                <Box
                  sx={{ mb: 2 }}
                  className="d-flex justify-center auth-vector"
                >
                  <ForgotPasswordIcon />
                </Box>
                <Text size={32} weight={700} center>
                  Set new password
                </Text>
                <Text
                  size={16}
                  weight={500}
                  mode="secondary"
                  sx={{ mt: 2 }}
                  center
                >
                  Your new password must be different from previously used
                  password.
                </Text>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Box
                    sx={{ mt: 5, mb: 5 }}
                    className=" justify-center items-center"
                  >
                    <Controller
                      control={control}
                      name="token"
                      render={({ field: { onChange, value, onBlur } }) => (
                        <CustomOtpInput
                          numInputs={6}
                          otp={value ? value : ""}
                          setOtp={onChange}
                          onBlur={onBlur}
                          errorText={errors?.token?.message}
                          label="Token"
                          description="Enter the verification token sent to your email address."
                        />
                      )}
                    />
                    <Box className="d-flex" sx={{ mt: 1 }}>
                      <Text size={12} weight={400}>
                        {`Didn't get the code?`}
                      </Text>
                      <button
                        disabled={seconds > 0 || resendingCode}
                        onClick={onResendCode}
                      >
                        <Text
                          size={12}
                          weight={500}
                          color={themeColors.primary}
                          sx={{
                            mx: "5px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          Resend Code{" "}
                          {resendingCode && (
                            <Spinner size={12} color={themeColors.primary} />
                          )}
                        </Text>
                      </button>
                    </Box>
                    {seconds > 0 && (
                      <Text size={11} weight={400} sx={{ mt: 0.5 }}>
                        After {seconds} seconds
                      </Text>
                    )}
                  </Box>
                  <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, value, onBlur } }) => (
                      <InputField
                        label="Password"
                        placeholder="Enter Password"
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        mt={1}
                        type={show ? "text" : "password"}
                        rightIcon
                        icon={
                          !show ? (
                            <AiOutlineEyeInvisible
                              color={themeColors.placeholder}
                              style={{ width: 24, height: 24 }}
                              className="pointer"
                              onClick={toggleShow}
                            />
                          ) : (
                            <AiOutlineEye
                              color={themeColors.placeholder}
                              style={{ width: 24, height: 24 }}
                              className="pointer"
                              onClick={toggleShow}
                            />
                          )
                        }
                        errorText={errors?.password?.message}
                      />
                    )}
                  />
                  <Box sx={{ overflow: "hidden" }}>
                    <Box sx={{ float: "left" }}>
                      <CustomRadio
                        disabled
                        label="At least 8 characters"
                        checked={
                          typeof password === "string" &&
                          password.trim().length >= 8
                        }
                        value=""
                        fontSize={10}
                      />
                    </Box>
                    <Box sx={{ float: "left" }}>
                      <CustomRadio
                        disabled
                        label="At least 1 symbol"
                        checked={
                          typeof password === "string" &&
                          containsSymbol(password)
                        }
                        value=""
                        fontSize={10}
                      />
                    </Box>
                    <Box sx={{ float: "left" }}>
                      <CustomRadio
                        disabled
                        label="At least 1 number"
                        checked={
                          typeof password === "string" &&
                          containsNumber(password)
                        }
                        value=""
                        fontSize={10}
                      />
                    </Box>
                  </Box>

                  <Controller
                    control={control}
                    name="confirmPassword"
                    render={({ field: { onChange, value, onBlur } }) => (
                      <InputField
                        label="Confirm Password"
                        placeholder="Confirm Password"
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        mt={1}
                        rightIcon
                        type={showConfirmPassword ? "text" : "password"}
                        errorText={errors?.confirmPassword?.message}
                        icon={
                          !showConfirmPassword ? (
                            <AiOutlineEyeInvisible
                              color={themeColors.placeholder}
                              style={{ width: 24, height: 24 }}
                              className="pointer"
                              onClick={toggleShowConfirmPassword}
                            />
                          ) : (
                            <AiOutlineEye
                              color={themeColors.placeholder}
                              style={{ width: 24, height: 24 }}
                              className="pointer"
                              onClick={toggleShowConfirmPassword}
                            />
                          )
                        }
                      />
                    )}
                  />

                  <Box
                    sx={{ mt: { xs: 2, md: 4 }, width: "100%" }}
                    className="d-flex justify-center items-center"
                  >
                    <CustomButton
                      mode="primary"
                      style={{ marginBottom: "16px" }}
                      type="submit"
                      loading={loading}
                    >
                      Reset password
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

export default ResetPasswordPage;
