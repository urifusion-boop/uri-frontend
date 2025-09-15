import CustomButton from '@/components/atoms/CustomButton';
import Text from '@/components/atoms/CustomText';
import InputField from '@/components/atoms/Input';
import AuthCard from '@/components/cards/AuthCard';
import useCustomTheme from '@/hooks/theme.hook';
import { useToggle } from '@/hooks/utils.hook';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Checkbox, FormControlLabel, Grid } from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

import CustomRadio from '@/components/atoms/CustomRadio';
import TAndCData from '@/components/landing/TAndCData';
import CustomModal from '@/components/modals/CustomModal';
import { containsLowercaseAndUppercase, containsSymbolAndNumber } from '@/configs/rules.config';
import { authRoutes } from '@/constants/ClientRoute';
import { useSignup } from '@/hooks/auth/signup.hook';
import { SignupFormValues } from '@/types';
import { IoMdClose } from 'react-icons/io';
import PhoneInput from '../atoms/PhoneInput';
import SkeletonLoader from '../loaders/SkeletonLoader';

const SignupForm = ({ showBorder = false, onSuccess }: { showBorder?: boolean; onSuccess?: () => void }) => {
  const { themeColors } = useCustomTheme();

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  const handleTermsChange = (event: any) => {
    setTermsAccepted(event.target.checked);
  };

  const toggleTermsModal = () => {
    setTermsModalOpen(!termsModalOpen);
  };

  const { show, toggleShow } = useToggle();

  const { navigate, SignupSchema, googleloading, loading, onSubmit, userExists, setUserExists } = useSignup();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignupFormValues>({
    mode: 'onBlur',
    resolver: zodResolver(SignupSchema),
  });

  const password = watch('password');

  return (
    <AuthCard className={!showBorder ? 'shadow-none border-0 max-w-[500px] w-full mx-auto' : ''} description="Please enter your details to get started">
      {googleloading ? (
        <Box
          sx={{
            width: '100%',
            height: '450px',
            position: 'relative',
          }}
        >
          <SkeletonLoader height="100%" />
        </Box>
      ) : (
        <form
          onSubmit={handleSubmit((data) => {
            onSubmit(data, onSuccess);
          })}
        >
          <Box sx={{ mt: { xs: 1 } }}>
            <Grid container alignItems={'stretch'} spacing={2}>
              <Grid item xs={12} lg={6}>
                <Controller
                  control={control}
                  name="firstName"
                  render={({ field: { onChange, value, onBlur } }) => (
                    <InputField
                      label="First Name"
                      type="text"
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      errorText={errors?.firstName?.message}
                      placeholder="First name"
                      removePadding
                      radius={2.5}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <Controller
                  control={control}
                  name="lastName"
                  render={({ field: { onChange, value, onBlur } }) => (
                    <InputField
                      label="Last Name"
                      type="text"
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      errorText={errors?.lastName?.message}
                      placeholder="Last name"
                      removePadding
                      radius={2.5}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, value, onBlur } }) => (
                    <InputField
                      radius={2.5}
                      noBg
                      label="Email"
                      type="email"
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      errorText={errors?.email?.message}
                      placeholder="hi@example.com"
                      removePadding
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <Controller
                  control={control}
                  name="phoneNumber"
                  render={({ field: { onChange, value, onBlur } }) => (
                    <PhoneInput
                      label="Phone Number"
                      value={value ?? ''}
                      onChange={(value) => (typeof value === 'string' ? onChange(value) : () => {})}
                      onBlur={onBlur}
                      errorText={errors?.phoneNumber?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, value, onBlur } }) => (
                    <InputField
                      radius={2.5}
                      noBg
                      label="Password"
                      placeholder="Enter Password"
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      mt={1}
                      type={show ? 'text' : 'password'}
                      rightIcon
                      icon={
                        !show ? (
                          <AiOutlineEyeInvisible color={themeColors.placeholder} style={{ width: 16, height: 16 }} className="pointer" onClick={toggleShow} />
                        ) : (
                          <AiOutlineEye color={themeColors.placeholder} style={{ width: 16, height: 16 }} className="pointer" onClick={toggleShow} />
                        )
                      }
                      errorText={errors?.password?.message}
                    />
                  )}
                />
              </Grid>

              {/* <Grid item xs={12} lg={6}>
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
                      type={showConfirmPassword ? "text" : "password"}
                      errorText={errors?.confirmPassword?.message}
                      rightIcon
                      icon={
                        !showConfirmPassword ? (
                          <AiOutlineEyeInvisible
                            color={themeColors.placeholder}
                            style={{ width: 16, height: 16 }}
                            className="pointer"
                            onClick={toggleConfirmPassword}
                          />
                        ) : (
                          <AiOutlineEye
                            color={themeColors.placeholder}
                            style={{ width: 16, height: 16 }}
                            className="pointer"
                            onClick={toggleConfirmPassword}
                          />
                        )
                      }
                    />
                  )}
                />
              </Grid> */}

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  pl: '10px',
                }}
              >
                <CustomRadio disabled color="#CD1B78" label="8 characters" value="" fontSize={12} checked={typeof password === 'string' && password.length >= 8} />

                <CustomRadio disabled label="1 symbol & number" checked={typeof password === 'string' && containsSymbolAndNumber(password)} value="" fontSize={12} />

                <CustomRadio disabled label="A lowercase and uppercase letter" checked={typeof password === 'string' && containsLowercaseAndUppercase(password)} value="" fontSize={12} />
              </Box>
            </Grid>
          </Box>

          <Box sx={{ my: 2 }}>
            <div className="flex items-center">
              <FormControlLabel control={<Checkbox checked={termsAccepted} onChange={handleTermsChange} color="primary" />} label="I agree to the" />

              <Text weight={400} style={{ marginLeft: '-10px', marginTop: 0.3 }} size={16} onClick={toggleTermsModal} className="pointer" sx={{ color: '#CD1B78' }}>
                Terms and Conditions
              </Text>
            </div>

            <CustomModal
              open={termsModalOpen}
              closeModal={toggleTermsModal}
              // Add styling to this Box to make the modal appear as you desire
              maxHeight="90vh"
            >
              <Box>
                <Box sx={{ padding: '30px 30px' }}>
                  <Box className="d-flex justify-between">
                    <Box className="d-flex items-center">
                      <Link href={process.env.NEXT_PUBLIC_CLIENT_HOST ?? '/'}>
                        <img src="/assets/images/logo.png" alt="logo" width={70} height={40} style={{ marginLeft: '10px' }} />
                      </Link>
                    </Box>
                    <IoMdClose
                      style={{
                        width: '30px',
                        height: '30px',
                        translate: '0px 20px',
                        cursor: 'pointer',
                      }}
                      onClick={() => toggleTermsModal()}
                    />
                  </Box>

                  <pre
                    style={{
                      whiteSpace: 'pre-line',
                    }}
                  >
                    <TAndCData />
                  </pre>
                </Box>
              </Box>
            </CustomModal>

            <CustomModal open={userExists} showCloseIcon setOpen={setUserExists} closeOnOverlayClick maxWidth="90%" width="500px">
              <Box
                sx={{
                  padding: '5px 20px 10px 20px',
                }}
              >
                <Text weight={600} size={16} className="pointer" sx={{ padding: '0px' }} center>
                  Existing User
                </Text>
                <Text weight={500} size={11} className="pointer" sx={{ padding: '10px' }} center>
                  Already have an account? The email address you used is currently registered with us.
                </Text>
                <CustomButton mode="primary" onClick={() => navigate(authRoutes.login)} style={{ marginTop: '20px' }}>
                  Continue to Login
                </CustomButton>
              </Box>
            </CustomModal>
          </Box>

          <Box sx={{ mt: 2 }}>
            <CustomButton mode="primary" style={{ marginBottom: '16px' }} loading={loading} type="submit" data-testid="signup-page-signup-button" disabled={!termsAccepted}>
              Sign up
            </CustomButton>
          </Box>

          {/* <div className='flex items-center gap-3 max-w-[480px] px-6 mx-auto'>
            <div className='w-full h-[1px] bg-gray-200'></div>
            <Typography fontSize={16} color={'#6C7272'} className='text-center'>
              Or
            </Typography>
            <div className='w-full h-[1px] bg-gray-200'></div>
          </div>

          <CustomButton
            textColor='#000'
            icon={<GoogleIcon width={30} height={30} />}
            mode='inverse'
            style={{ marginTop: '16px' }}
            onClick={() => getGoogleAuth('creative')}
            type='button'
            loading={googleloading}>
            Continue with Google
          </CustomButton> */}
        </form>
      )}

      <Box className="d-flex items-center justify-center mt-4">
        <Text size={14} weight={500} center mode="secondary">
          Already have an account?
        </Text>
        <Text size={11} weight={700} sx={{ marginLeft: '3px' }} className="pointer" color="#CD1B78" onClick={() => navigate(authRoutes.login)}>
          Log in
        </Text>
      </Box>
    </AuthCard>
  );
};

export default SignupForm;
