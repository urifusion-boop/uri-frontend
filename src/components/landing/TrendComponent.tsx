import { Grid, Typography, Button, Box, useMediaQuery } from '@mui/material';
import useCustomTheme from '@/hooks/theme.hook';
import { FaArrowRightLong } from 'react-icons/fa6';

export const TrendComponent: React.FC = () => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(max-width:1200px)');
  const { themeColors } = useCustomTheme();
  return (
    <Grid
      width={'100%'}
      height={'auto'}
      alignItems={'stretch'}
      zIndex={2}
      display={'flex'}
      flexDirection={'row'}
      overflow={'hidden'}
      mt={2}
      padding={0} // Ensure no additional padding
      margin={0} // Ensure no additional margin
    >
      <Box
        width={'65%'}
        display={isMobile ? 'none' : 'block'}
        overflow={'hidden'}
        sx={{
          backgroundImage: `url('/assets/images/landing/social-trend.jpg')`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '900px',
          backgroundClip: 'padding-box',

          // Temporarily remove backgroundColor and borderColor
        }}
        marginRight={4}></Box>

      <Box
        width={isMobile ? 'auto' : '35%'}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          justifyContent: 'center',
          padding: 0,
          margin: 0,
          paddingLeft: isMobile ? 4 : 0,
          paddingRight: isMobile ? 4 : 0,
        }}>
        <Typography variant='h3' sx={{ fontWeight: 'bold' }}>
          Stay
          <span style={{ color: themeColors.primary }}> Ahead </span>
          of the <br />
          Curve
        </Typography>
        <Typography
          variant='caption'
          sx={{ maxWidth: { md: '300px', lg: '400px' } }}>
          Discover what&apos;s trending in your industry or niche before your
          competitors.
          <b>
            Gain deeper insights into how your audience feels about topics,
            brands, or campaigns, helping you craft strategies that truly
            resonate.
          </b>
        </Typography>
        <Button
          variant='outlined'
          sx={{
            fontWeight: 'bold',
            display: 'flex',
            mt: 3,
            gap: 1,
            alignItems: 'center',
            width: 'fit-content',
          }}>
          Get started <FaArrowRightLong />
        </Button>
      </Box>
    </Grid>
  );
};
