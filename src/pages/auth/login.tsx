import AuthLayout from '@/components/atoms/AuthLayout';
import CustomButton from '@/components/atoms/CustomButton';
import InputField from '@/components/atoms/Input';
import AuthCard from '@/components/cards/AuthCard';
import { authRoutes } from '@/constants/ClientRoute';
import { useLoginHook } from '@/hooks/auth/login.hook';
import useCustomThene from '@/hooks/theme.hook';
import { useToggle } from '@/hooks/utils.hook';
import { useAuth } from '@/providers/AuthProvider';
import { LoginFormValues } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import SeoHead from '../../components/atoms/SeoHead';

const LoginPage = () => {
  const { themeColors } = useCustomThene();
  const { LoginSchema, onSubmit, loading } = useLoginHook();
  const { show, toggleShow } = useToggle();

  const { setRememberMe, loadRememberMeCredentials } = useAuth();
  const [rememberMeChecked, setRememberMeChecked] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginFormValues>({
    mode: 'onBlur',
    resolver: zodResolver(LoginSchema),
  });

  useEffect(() => {
    const loadSavedCredentials = async () => {
      const credentials = await loadRememberMeCredentials();

      if (credentials.email) {
        setValue('email', credentials.email);
        setValue('password', credentials.password ?? '');
      }
    };

    loadSavedCredentials();
  }, [loadRememberMeCredentials, setValue, rememberMeChecked]);

  const handleFormSubmit = (data: LoginFormValues) => {
    onSubmit(data);
  };

  return (
    <>
      <SeoHead title="Login" />

      <AuthLayout>
        {/* <Box>
          <Text size={32} weight={700}>
            Welcome Back
          </Text>
          <Text size={16} weight={500} mode='secondary'>
            Powered by PenGrid Technologies Limited.
          </Text>
          {googleloading ? (
            <Box
              sx={{
                width: '100%',
                height: '450px',
                position: 'relative',
              }}>
              <SkeletonLoader height='100%' />
            </Box>
          ) : (
            <>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{ mt: { xs: 2, md: 3 } }}>
                  <Controller
                    control={control}
                    name='email'
                    render={({ field: { onChange, value, onBlur } }) => (
                      <InputField
                        label='Email'
                        type='email'
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        errorText={errors?.email?.message}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name='password'
                    render={({ field: { onChange, value, onBlur } }) => (
                      <InputField
                        label='Enter Password'
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        mt={2}
                        errorText={errors?.password?.message}
                        type={show ? 'text' : 'password'}
                        rightIcon
                        icon={
                          !show ? (
                            <AiOutlineEyeInvisible
                              color={themeColors.placeholder}
                              style={{ width: 24, height: 24 }}
                              className='pointer'
                              onClick={toggleShow}
                            />
                          ) : (
                            <AiOutlineEye
                              color={themeColors.placeholder}
                              style={{ width: 24, height: 24 }}
                              className='pointer'
                              onClick={toggleShow}
                            />
                          )
                        }
                      />
                    )}
                  />
                  <Box className='d-flex justify-end' sx={{ mt: 1 }}>
                    <Text
                      size={14}
                      weight={500}
                      mode='primary'
                      className='pointer'
                      onClick={() => navigate('forgot-password')}>
                      Forgot Password?
                    </Text>
                  </Box>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <CustomButton
                    mode='primary'
                    style={{ marginBottom: '16px' }}
                    type='submit'
                    loading={loading}
                    data-testid='login-page-login-button'>
                    Login
                  </CustomButton>
                </Box>
              </form>

              <CustomButton
                mode='inverse'
                onClick={() => getGoogleAuth()}
                loading={googleloading}
                style={{ marginTop: '20px', marginBottom: '20px' }}
                disabled={googleloading}>
                <GoogleIcon width={30} height={30} />
                Sign In with Google
              </CustomButton>

              <Box className='d-flex items-center justify-center'>
                <Text size={14} weight={500} center mode='secondary'>
                  {`Don't have an account?`}
                </Text>
                <Text
                  size={14}
                  weight={700}
                  sx={{ marginLeft: '3px' }}
                  className='pointer'
                  mode='base'
                  onClick={() => navigate(authRoutes.signupAs)}
                  data-testid='login-page-route-signup-button'>
                  Sign up
                </Text>
              </Box>
            </>
          )}
        </Box> */}

        <AuthCard description="Please enter your login details to continue to drive insight">
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <Box sx={{ mt: { xs: 2, md: 3 } }}>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value, onBlur } }) => (
                  <InputField label="Email Address" type="email" value={value} onChange={onChange} onBlur={onBlur} errorText={errors?.email?.message} removePadding radius={2.5} />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value, onBlur } }) => (
                  <InputField
                    label="Enter Password"
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    mt={3}
                    errorText={errors?.password?.message}
                    type={show ? 'text' : 'password'}
                    rightIcon
                    removePadding
                    radius={2.5}
                    icon={
                      !show ? (
                        <AiOutlineEyeInvisible color={themeColors.placeholder} style={{ width: 24, height: 24 }} className="pointer" onClick={toggleShow} />
                      ) : (
                        <AiOutlineEye color={themeColors.placeholder} style={{ width: 24, height: 24 }} className="pointer" onClick={toggleShow} />
                      )
                    }
                  />
                )}
              />
              <Box className="d-flex justify-between items-center mt-[18px]">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMeChecked}
                      onChange={() => {
                        setRememberMeChecked(!rememberMeChecked);
                        setRememberMe(!rememberMeChecked);
                      }}
                      color="primary"
                    />
                  }
                  label={
                    <Typography fontSize={14} color={'#6C7272'}>
                      Remember me
                    </Typography>
                  }
                />
                <Link href={authRoutes.forgotPassword}>
                  <Typography fontSize={16} color={'#CD1B78'} className="pointer">
                    Forgot Password?
                  </Typography>
                </Link>
              </Box>
            </Box>
            <Box sx={{ mt: 2 }}>
              <CustomButton mode="primary" style={{ marginBottom: '16px' }} type="submit" loading={loading} data-testid="login-page-login-button">
                Login
              </CustomButton>
            </Box>
          </form>

          {/* <div className="flex items-center gap-3 max-w-[480px] px-6 mx-auto">
            <div className="w-full h-[1px] bg-gray-200"></div>
            <Typography fontSize={16} color={"#6C7272"} className="text-center">
              Or
            </Typography>
            <div className="w-full h-[1px] bg-gray-200"></div>
          </div>

          <CustomButton
            textColor="#000"
            icon={<GoogleIcon width={30} height={30} />}
            mode="inverse"
            style={{ marginTop: "16px" }}
            onClick={() => getGoogleAuth()}
            type="button"
            loading={googleloading}
          >
            Continue with Google
          </CustomButton> */}

          <Box className="d-flex items-center justify-center mt-[20px]">
            <Typography fontSize={16} color={'#6C7272'} className="text-center">
              Don&apos;t have an account?
            </Typography>
            <Link href={authRoutes.signupAs}>
              <Typography fontSize={16} fontWeight={600} color={'#CD1B78'} className="pointer" sx={{ marginLeft: '3px' }}>
                Sign up
              </Typography>
            </Link>
          </Box>
        </AuthCard>
      </AuthLayout>
    </>
  );
};

export default LoginPage;
