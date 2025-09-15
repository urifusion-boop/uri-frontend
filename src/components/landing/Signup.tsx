import { Box, Grid, Typography, useMediaQuery, Button } from '@mui/material';
import React from 'react';
import Text from '../atoms/CustomText';
import styles from '../../styles/landing.module.css';
import CustomButton from '../atoms/CustomButton';
import useCustomTheme from '../../hooks/theme.hook';
import { useRouter } from 'next/router';
import { authRoutes } from '../../constants/ClientRoute';
import { FiArrowUpRight } from 'react-icons/fi';
import { FaArrowRight } from 'react-icons/fa';

const Signup = () => {
  const { themeColors } = useCustomTheme();
  const isMobile = useMediaQuery('(max-width:800px)');
  const router = useRouter();

  return (
    // <Box className={styles.signupContainer}>
    //   <span className={styles.signupTitle}>
    //     {`Join URI’S Thriving Community!`}
    //   </span>
    //   <Text size={15} weight={300} color="white" center>
    //     Sign up now as a creative or a client to discover a world of
    //     opportunities and collaborations
    //   </Text>
    //   <CustomButton
    //     mode="inverse"
    //     style={{
    //       width: "200px",
    //       backgroundColor: "white",
    //       color: themeColors.primary,
    //       margin: "50px calc(50% - 100px) 0px calc(50% - 100px)",
    //       fontSize: "17px",
    //       fontWeight: "500",
    //     }}
    //     type="submit"
    //     loading={false}
    //     onClick={() => router.push(authRoutes.signupAs)}
    //   >
    //     <Text
    //       color="#CD1B78"
    //       size={20}
    //       weight={500}
    //       sx={{ ":hover": { textDecoration: "underline" } }}
    //       style={{ fontFamily: "poorich" }}
    //     >
    //       Signup Now
    //     </Text>
    //   </CustomButton>
    // </Box>

    <Grid
      display={'grid'}
      className={styles.signupContainer}
      gridTemplateColumns={isMobile ? '1fr' : 'repeat(2, 1fr)'}
      alignItems={'stretch'}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Typography
          variant='body1'
          sx={{ color: '#FFF', fontWeight: 'bold', mb: 2 }}>
          {' '}
          TRY IT NOW{' '}
        </Typography>
        <Typography
          sx={{
            color: themeColors.background,
            fontSize: '26px',
            lineHeight: '100%',
          }}>
          {' '}
          Unlock Your Brand&lsquo;s Full Potential
        </Typography>
        <Typography variant='body2' sx={{ color: '#FFF' }}>
          {' '}
          Uri - The Social Listening Tool to Elevate Your Brand&lsquo;s
          Influence
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          marginTop: 1,
        }}>
        <Button
          variant={'contained'}
          sx={{
            color: '#000',
            backgroundColor: themeColors.inputBorder,
            fontSize: '14px',
            fontWeight: 'bold',
            borderRadius: '5px',
            padding: '10px 20px',
            boxShadow: 2,
            '&:hover': {
              backgroundColor: '#FFF',
              color: themeColors.primary,
              boxShadow: 2,
            },
          }}
          onClick={() => router.push(authRoutes.signupAs)}>
          Get Started Now
        </Button>
        <Button
          sx={{
            border: `1px solid ${themeColors.borderColor}`,
            fontWeight: 'bold',
            borderRadius: '5px',
            padding: '10px 20px',
            color: '#FFF',
            display: 'flex',
            gap: 1,
            alignItems: 'center',
            '&:hover': {
              backgroundColor: themeColors.primary,
              boxShadow: 2,
            },
          }}>
          Learn More{' '}
          <span style={{ transform: 'rotate(-45deg)' }}>
            {' '}
            <FaArrowRight />{' '}
          </span>
        </Button>
      </Box>
    </Grid>
  );
};

export default Signup;
