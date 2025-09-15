import { Box, Button, Grid, Link, Typography, useMediaQuery } from '@mui/material';
import React, { useState } from 'react';

import { ContactMessageService } from '@/api/ContactService';
import { TextHelper } from '@/helpers/TextHelper';
import { useModal } from '@/hooks/utils.hook';
import CustomButton from '../atoms/CustomButton';
import Text from '../atoms/CustomText';
import TextAreaField from '../atoms/CustomTextArea';
import InputField from '../atoms/Input';
import CustomModal from '../modals/CustomModal';

const UpperFooter: React.FC = () => {
  const isMobile = useMediaQuery('(max-width:600px)');

  const { open, setOpen, openModal } = useModal();
  const [contactFormDetails, setContactFormDetails] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [messageSent, setMessageSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const sendContactMessage = async () => {
    setIsLoading(true);
    const response = await ContactMessageService.createMessageApi(contactFormDetails);
    if (response.status) setMessageSent(true);
    setIsLoading(false);
    setContactFormDetails({
      name: '',
      email: '',
      message: '',
    });
  };

  return (
    <>
      <Box
        sx={{
          backgroundImage: 'url("/assets/images/landing/abstract2.jpg")', // Replace with an actual image URL
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.8)', // White background overlay
          color: '#333333', // Dark text color for contrast on light background
          padding: isMobile ? '3rem 2.6rem' : '3rem 5rem',
          position: 'relative',
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.8)', // White overlay with opacity
            zIndex: 1,
          },
          zIndex: 2,
        }}
      >
        <div className="md:flex container justify-between gap-2 relative md:space-y-0 space-y-8 z-[99999999]">
          {/* Digital Business Transformation Column */}
          <Grid item xs={12} sm={6} md={4}>
            <Box>
              <img
                src="/assets/images/landing/logo.png" // Update logo for better contrast on light background
                alt="Image not found"
                style={{ width: '100px' }}
              />
            </Box>
            <Typography variant="body1" fontWeight="bold" gutterBottom fontStyle={'italic'}>
              Enhancing Business Growth
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom maxWidth={'350px'}>
              Transform your businesses in order to survive in a completely digitized and connected world driven by software innovation.
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'flex-start',
                marginTop: '1rem',
              }}
            >
              <img
                src="/assets/images/soon/goggleone.jpg"
                alt="Image not found"
                style={{
                  width: '100px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              />
              <img
                src="/assets/images/soon/goggletwo.jpg"
                alt="Image not found"
                style={{
                  width: '100px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              />
            </Box>
          </Grid>

          {/* Quick Links Column */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              QUICK LINKS
            </Typography>
            {[
              { title: 'Explore Features', href: '#' },
              // { title: 'Pricing', href: '/pricing' },
            ].map((link, index) => (
              <Link href={link.href} key={index} color="inherit" underline="hover" display="block" sx={{ marginBottom: '0.5rem', color: '#333333' }}>
                <Typography>{link.title}</Typography>
              </Link>
            ))}
          </Grid>

          {/* Quick Links Column */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              OUR SOLUTIONS
            </Typography>
            {[
              { link: '/agencies', title: 'For Agencies' },
              { title: 'For Startups', link: '/startups' },
              { title: 'For Business', link: '/business-owners' },
              { title: 'For Product Teams', link: '/product-teams' },
              {
                title: 'For Media and Entertainment',
                link: '/media-and-entertainment',
              },
            ].map((link, index) => (
              <Link
                color="inherit"
                underline="hover"
                display="block"
                href={link.link}
                key={index}
                sx={{
                  marginBottom: '0.5rem',
                  color: '#333333',
                  cursor: 'pointer',
                }}
              >
                <Typography>{link.title}</Typography>
              </Link>
            ))}
          </Grid>

          {/* About Column */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              ABOUT
            </Typography>
            {['Company', 'Partner with us', 'Careers'].map((link, index) => (
              <Link href={link === 'Partner with us' ? '/partner' : '#'} key={index} color="inherit" underline="hover" display="block" sx={{ marginBottom: '0.5rem', color: '#333333' }}>
                <Typography>{link}</Typography>
              </Link>
            ))}
          </Grid>

          {/* Contact Us Column */}
          <Grid item xs={12} sm={6} md={2}>
            <Button
              variant="outlined"
              onClick={openModal}
              sx={{
                color: '#333333',
                borderColor: '#00a2e3',
                borderRadius: '5px',
                padding: '0.5rem 1.5rem',
                '&:hover': {
                  borderColor: '#007bb5',
                },
              }}
            >
              CONTACT US
            </Button>

            <Typography variant="body2" sx={{ marginTop: '1rem', fontSize: '1rem', color: '#333333' }}>
              +234-707-630-7855
            </Typography>
          </Grid>
        </div>
      </Box>
      <CustomModal width="556px" open={open} setOpen={setOpen} closeOnOverlayClick={true}>
        {!messageSent ? (
          <Box sx={{ padding: '10px 10px' }}>
            <Text size={32} weight={700} center>
              Reach out to us!
            </Text>
            <Text size={16} weight={500} sx={{ mb: 2 }} center>
              {`We're always happy to hear from you.`}
            </Text>

            <Box mb={2}>
              <InputField
                placeholder="Your Full Name"
                type="text"
                value={contactFormDetails.name}
                onChange={(e) => {
                  setContactFormDetails({
                    ...contactFormDetails,
                    name: e.target.value,
                  });
                }}
              />
              {contactFormDetails.name.trim().length < 3 ? (
                <Text size={12} weight={400} color="red">
                  Full Name must be at least three characters.
                </Text>
              ) : null}
            </Box>
            <Box mb={2}>
              <InputField
                placeholder="Your Email Address"
                type="email"
                value={contactFormDetails.email}
                onChange={(e) => {
                  setContactFormDetails({
                    ...contactFormDetails,
                    email: e.target.value,
                  });
                }}
                style={{ marginBottom: '20px' }}
              />
              {!TextHelper.containsEmail(contactFormDetails.email) ? (
                <Text size={12} weight={400} color="red">
                  Please input a valid email address.
                </Text>
              ) : null}
            </Box>
            <TextAreaField
              style={{
                padding: '30px',
                fontSize: '15px',
              }}
              placeholder="Your message."
              value={contactFormDetails.message}
              onChange={(e) =>
                setContactFormDetails({
                  ...contactFormDetails,
                  message: e.target.value,
                })
              }
            />
            {contactFormDetails.message.trim().length < 10 ? (
              <Text size={12} weight={400} color="red">
                Message must be at least ten characters.
              </Text>
            ) : null}

            <CustomButton
              mode="primary"
              style={{ margin: '35px 0px' }}
              type="submit"
              loading={isLoading}
              disabled={isLoading || contactFormDetails.name.trim().length < 3 || !TextHelper.containsEmail(contactFormDetails.email) || contactFormDetails.message.trim().length < 10}
              data-testid="close-request-sent-button"
              onClick={() => {
                sendContactMessage();
              }}
            >
              Submit
            </CustomButton>
          </Box>
        ) : (
          <Box sx={{ padding: '10px 30px' }}>
            <Text size={52} weight={700} center>
              ✅
            </Text>
            <Text size={20} weight={500} sx={{ lineHeight: '50px' }} center>
              Thank you for your message.
              <br />
              We will respond to you shortly.
            </Text>
            <CustomButton
              mode="primary"
              style={{ margin: '35px 0px' }}
              type="submit"
              data-testid="close-request-sent-button"
              onClick={() => {
                setOpen(false);
                setMessageSent(false);
              }}
            >
              Close
            </CustomButton>
          </Box>
        )}
      </CustomModal>
    </>
  );
};

export default UpperFooter;
