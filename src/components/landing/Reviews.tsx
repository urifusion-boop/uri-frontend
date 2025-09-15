import { Box, Grid } from '@mui/material';

import useResponsiveness from '@/hooks/useResponsiveness';
import styles from '../../styles/landing.module.css';
import Text from '../atoms/CustomText';

const tempReviews = [
  {
    name: 'Damilola Obidairo',
    image: '/assets/images/landing/gear.jpg',
    type: 'CEO of 8th Gear Ventures Studios',
    content: 'What you guys have built is a global product, and that is the highest compliment I can give to any company.',
  },
  {
    name: 'Joshua War',
    image: 'assets/images/landing/alx.svg',
    type: 'ALX',
    content: 'I think what you’re doing is really fascinating. Social media is the new battleground, and data is essential for driving decision-making.',
  },
  {
    name: 'Adekemi Rasheedat',
    image: '/assets/images/landing/kemi.jpg',
    type: 'Digital Marketer & Content Creator',
    content: 'Uri helped me boost engagement like never before and significantly improved my results',
  },
];

const Reviews = () => {
  const { isMobile } = useResponsiveness();

  return (
    <Box className={styles.connectContainer} id="testimonials">
      <Grid display={'grid'} justifyContent={isMobile ? 'start' : 'center'}>
        <h2 className="text-[#CD1B78] text-xl font-semibold mx-auto">TESTIMONIAL</h2>
        <h3 className="text-[#000000] text-[32px] md:text-[48px] font-bold mx-auto py-2 text-center">
          What <span className="text-[#CD1B78]">Our Users</span> Say
        </h3>

        <p className="max-w-[959px] mx-auto text-center text-[#080808] text-lg md:text-[24px] mt-1 font-urbanist font-medium leading-snug">
          See How Uri is Empowering Clients and Creatives to Achieve Remarkable Results
        </p>
      </Grid>

      <Grid container spacing={2} sx={{ mt: 2 }} columnSpacing={5}>
        {tempReviews.length > 0 &&
          tempReviews.map((review, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Box
                sx={{
                  borderRadius: '8px',
                  padding: '30px',
                  boxShadow: index % 2 !== 0 ? '0 21px 17px 1px rgba(0, 0, 0, 0.1)' : 'none',
                  maxHeight: '350px',
                  minHeight: '100%',
                  backgroundColor: '#fffcfe',
                  margin: '0 auto',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: '0 10px 20px -5px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                <img src="/assets/icons/quote-icon.svg" alt="Image not found" style={{ translate: '-10px 0px' }} />
                <Text size={isMobile ? 12 : 16} weight={300} sx={{ my: 2, lineHeight: '30px' }}>
                  {review.content}
                </Text>
                <Box className="d-flex">
                  {/* <Box
                    sx={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50px",
                      backgroundImage: `url(${review.image})`,
                      backgroundSize: "cover",
                      marginRight: "10px",
                    }}
                  ></Box> */}
                  <img
                    src={review.image}
                    alt="Image not found"
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50px',
                      marginRight: '10px',
                    }}
                  />
                  <Box sx={{ width: 'calc(100% - 60px)' }}>
                    <Text size={isMobile ? 12 : 16} weight={600}>
                      {review.name}
                    </Text>
                    <Text size={isMobile ? 10 : 12} weight={300}>
                      {review.type}
                    </Text>
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};

export default Reviews;
