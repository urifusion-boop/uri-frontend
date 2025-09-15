import { Box, Grid, Typography, useMediaQuery } from '@mui/material';
import React, { useState } from 'react';
import Text from '../atoms/CustomText';
import styles from '../../styles/landing.module.css';
import useCustomTheme from '@/hooks/theme.hook';

const tempCreatives = [
  {
    name: 'Chidinma Odor',
    image: `${process.env.NEXT_PUBLIC_AZURE_BLOB_STORAGE_BASE_URL}webimages/ChidinmaOdor2.jpg`,
    type: 'Content Creator',
  },

  {
    name: 'Adegoke Pelumi',
    image: `${process.env.NEXT_PUBLIC_AZURE_BLOB_STORAGE_BASE_URL}webimages/AdegokePelumi3.jpg`,
    type: 'Content Creator',
  },
  {
    name: 'Michael Kenneth',
    image: `${process.env.NEXT_PUBLIC_AZURE_BLOB_STORAGE_BASE_URL}webimages/MichealKenneth2.jpg`,
    type: 'Model',
  },
  {
    name: 'Precious Zino',
    image: '/assets/images/landing/creative-image-7.jpeg',
    type: 'Model',
  },
];

const TopCreatives = () => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const matches = useMediaQuery('(max-width: 920px)');
  const { themeColors } = useCustomTheme();

  return (
    <Box className={styles.connectContainer} id='creatives'>
      <Typography
        sx={{ fontWeight: 700, zIndex: 10 }}
        variant={'h4'}
        align='center'
        marginLeft={'auto'}
        marginRight={'auto'}
        maxWidth={'md'}>
        Our Top
        <span
          style={{
            color: themeColors.primary,
            marginLeft: '10px',
            marginRight: '10px',
          }}>
          Creatives
        </span>{' '}
      </Typography>

      <Box
        className={styles.topCreatives}
        sx={{
          width: '100%',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
        }}
        mt={3}
        maxWidth={'1200px'}
        mx={'auto'}>
        {tempCreatives.length > 0 &&
          tempCreatives.map((creative, index) => (
            <Box
              sx={{
                width: '280px',
                height: '370px',
                display: 'inline-block',
              }}
              key={index}>
              <Box
                sx={{
                  width: '250px',
                  height: '400px',
                  margin: '20px calc(50% - 100px)',
                  backgroundImage: `url(${creative.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.5)', // Adjusted for reduced opacity
                  border: '1px solid',
                  transition: 'transform 0.5s ease', // Smooth transition for the hover effect
                  ':hover': {
                    transform: 'scale(1.05)', // Scales up the Box to 105% of its size on hover
                    boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.7)', // Optionally, make the shadow deeper on hover
                  },
                }}></Box>
              <Text size={24} weight={600} sx={{ mt: 2 }} center>
                {creative.name}
              </Text>
              <Text size={16} weight={400} sx={{ mt: 2 }} center>
                {creative.type}
              </Text>
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default TopCreatives;
