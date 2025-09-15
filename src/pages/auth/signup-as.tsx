import CustomButton from '@/components/atoms/CustomButton';
import Text from '@/components/atoms/CustomText';
import { EnvelopeIcon, PersonalDetailsIcon, RocketIcon } from '@/components/atoms/Icons';
import OTPInput from '@/components/atoms/OTPInput';
import SeoHead from '@/components/atoms/SeoHead';
import YouTubeEmbed from '@/components/atoms/YouTubeEmbed';
import SignupForm from '@/components/auth/SignupForm';
import { useEmailVerificationHook } from '@/hooks/auth/emailVerification.hook';
import { Box, Step, StepLabel, Stepper, styled } from '@mui/material';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FaArrowLeftLong } from 'react-icons/fa6';

const steps = [
  {
    label: 'Personal Details',
    description: 'Enter your details and create a password',
    icon: <PersonalDetailsIcon />,
  },
  {
    label: 'Verify your email',
    description: 'Input Verification code',
    icon: <EnvelopeIcon />,
  },
  {
    label: 'Welcome to Uri',
    description: 'Set up your profile',
    icon: <RocketIcon />,
  },
];

const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 0,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      background: theme.palette.primary.main,
      top: 0,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      background: theme.palette.primary.main,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 40,
    width: 2,
    border: 0,
    backgroundColor: '#eaeaf0',
    marginLeft: 14,
  },
}));

const CustomStepIcon = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor: '#fff',
  zIndex: 1,
  padding: 10,
  borderRadius: 10,
  border: '1px solid #D5D5D5',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  ...(ownerState.active && {
    '& svg path': {
      fill: theme.palette.primary.main,
    },
  }),
  ...(ownerState.completed && {
    '& svg path': {
      fill: theme.palette.primary.main,
    },
  }),
}));

const StepIconComponent = (props: StepIconProps) => {
  const { active, completed, className, icon } = props;

  return (
    <CustomStepIcon ownerState={{ completed, active }} className={className}>
      {steps[Number(icon) - 1].icon}
    </CustomStepIcon>
  );
};

const SignupAsPage = () => {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const { status, verifyEmail, resendVerificationEmail, token, setToken, loading } = useEmailVerificationHook();

  useEffect(() => {
    if (status === 'confirmed') {
      setActiveStep(2);
    }
  }, [status]);

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <motion.div key="step1" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100, opacity: 0 }} transition={{ duration: 0.3 }}>
            <SignupForm onSuccess={() => setActiveStep(1)} />
          </motion.div>
        );

      case 1:
        return (
          <motion.div key="step2" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100, opacity: 0 }} transition={{ duration: 0.3 }}>
            <div className="flex flex-col items-center">
              <Link className="mx-auto max-w-fit block" href={process.env.NEXT_PUBLIC_CLIENT_HOST ?? '/'}>
                <img src="/assets/images/logo.png" alt="logo" width={50} height={20} />
              </Link>
              <Text size={30} className="md:text-[30px] text-[20px] text-center md:mt-[20px] mt-[10px]" weight={700}>
                Email Verification
              </Text>
              <Text color={'#6C727F'} className="max-w-[480px] text-center mx-auto mb-8" size={14} weight={500} sx={{ mb: 5 }}>
                Enter the six digit code we sent to your email address. If you don&apos;t see the email in your inbox, please check your spam folder.
              </Text>

              <OTPInput
                length={6}
                onChange={(value) => {
                  setToken(value);
                }}
                onComplete={(value) => {
                  if (value.length === 6) {
                    verifyEmail(value);
                  }
                }}
              />

              <div className="mt-6 flex items-center gap-1 hover:underline md:mb-[60px] mb-[30px]">
                <Text
                  size={14}
                  weight={700}
                  style={{
                    textAlign: 'center',
                  }}
                >
                  Didn&apos;t receive code?
                </Text>
                <button
                  onClick={() => {
                    resendVerificationEmail();
                  }}
                >
                  <Text size={14} weight={700} color={'#CD1B78'}>
                    Resend
                  </Text>
                </button>
              </div>

              <CustomButton
                onClick={() => {
                  setActiveStep(2);
                }}
                disabled={token?.length !== 6}
                loading={loading}
                mode="primary"
                style={{
                  maxWidth: '470px',
                  margin: '0 auto',
                }}
                type="submit"
              >
                Verify Email
              </CustomButton>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div key="step3" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100, opacity: 0 }} transition={{ duration: 0.3 }}>
            <div className="flex flex-col items-center">
              <Link className="mx-auto max-w-fit block" href={process.env.NEXT_PUBLIC_CLIENT_HOST ?? '/'}>
                <img src="/assets/images/logo.png" alt="logo" width={50} height={20} />
              </Link>
              <div className="md:mt-[128px] md:mb-[91px]">
                <YouTubeEmbed url="https://youtu.be/1qpvBioMUME" width="470" height="264" />
              </div>

              <CustomButton
                onClick={() => router.push('/login')}
                mode="primary"
                style={{
                  maxWidth: '470px',
                  margin: '24px auto 0',
                }}
                type="submit"
              >
                Get Started
              </CustomButton>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <SeoHead title="Authentication" />

      <Box className="bg-white h-screen md:p-[50px] p-[10px] max-h-[1024px]">
        <div className="max-w-[1400px] min-h-[100%] mx-auto flex">
          <div className="bg-onboarding-image bg-cover min-h-full bg-no-repeat min-w-[300px] lg:min-w-[528px] p-[50px] rounded-[28px] hidden md:grid grid-rows-[auto_1fr_auto]">
            <Link className="w-fit block" href={process.env.NEXT_PUBLIC_CLIENT_HOST ?? '/'}>
              <img src="/assets/images/logo.png" alt="logo" width={50} height={32.5} />
            </Link>
            <div>
              <Stepper
                style={{
                  marginTop: '70px',
                }}
                activeStep={activeStep}
                orientation="vertical"
                connector={<CustomConnector />}
              >
                {steps.map((step, index) => (
                  <Step key={step.label}>
                    <StepLabel StepIconComponent={StepIconComponent}>
                      <Text
                        style={{
                          color: activeStep === index ? '#434343' : '#838383',
                        }}
                        className="ml-[8px]"
                        size={18}
                        weight={700}
                      >
                        {step.label}
                      </Text>
                      <Text
                        className="ml-[8px]"
                        size={14}
                        weight={500}
                        style={{
                          color: activeStep === index ? '#434343' : '#838383',
                        }}
                      >
                        {step.description}
                      </Text>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </div>

            <div className="mt-auto flex justify-between items-center -ml-4">
              <Link href="/" className="flex items-center gap-2">
                <FaArrowLeftLong />
                <Text size={14} weight={700}>
                  Back to home
                </Text>
              </Link>
              <Link href="/login">
                <Text size={14} weight={700}>
                  Sign in
                </Text>
              </Link>
            </div>
          </div>

          <Box
            sx={{
              flex: 1,
              padding: '40px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <AnimatePresence mode="wait">{renderStepContent(activeStep)}</AnimatePresence>

            <div className="flex gap-2 pt-4 mt-[auto] justify-center">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  className={`h-[5px] max-w-[60px] rounded-full flex-1`}
                  style={{
                    backgroundColor: activeStep === i ? '#CD1B78' : '#D9D9D9',
                  }}
                  key={'step-' + i}
                />
              ))}
            </div>
          </Box>
        </div>
      </Box>
    </>
  );
};

export default SignupAsPage;
