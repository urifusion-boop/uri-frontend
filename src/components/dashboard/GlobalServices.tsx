import { Box, Button, Typography, styled } from '@mui/material';

import { LightThemeColors } from '@/configs/colors.config';
import { useModal } from '@/hooks/utils.hook';
import ChartLine from '@/utils/icon/ChartLine';
import HeartRateSearch from '@/utils/icon/HeartRateSearch';
import { useRouter } from 'next/router';
import React from 'react';
import { BiBot } from 'react-icons/bi';
import { FaFolder } from 'react-icons/fa';
import { HiHashtag } from 'react-icons/hi';
import { MdRecordVoiceOver } from 'react-icons/md';
import { PiBellRingingFill } from 'react-icons/pi';
import HorizontalSlider from '../atoms/HorizontalSlider';
import { ComingSoonComponent } from '../atoms/keyword_tracking/ComingSoonComponent';
import CustomModal from '../modals/CustomModal';

const Container = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  // paddingX: '1.5rem',
  width: '100%',
  position: 'relative',
});

const globalData = [
  {
    title: 'Account Tracking',
    description: 'Track your account performance and growth over time.',
    icon: (
      <ChartLine
        style={{
          color: LightThemeColors.uriColor,
          width: 50,
          height: 50,
        }}
      />
    ),
    href: '/account-tracking',
  },
  {
    title: 'Keyword Tracking',
    description: 'Track your keyword performance and growth over time.',
    icon: (
      <HeartRateSearch
        style={{
          color: LightThemeColors.uriColor,
          width: 50,
          height: 50,
        }}
      />
    ),
    href: '/keyword-tracking/overview',
  },
  {
    title: 'Content Management',
    description: 'Manage your content and track its performance over time.',
    icon: (
      <FaFolder
        style={{
          color: LightThemeColors.uriColor,
          width: 50,
          height: 50,
        }}
      />
    ),
    href: '/content-management/create',
  },
  {
    title: 'Hashtag Tracking',
    description: 'Track your hashtag performance and growth over time.',
    icon: <HiHashtag size={50} color={LightThemeColors.uriColor} />,
    href: '/hashtag-tracking',
  },
  {
    title: 'Lead Generation',
    description: 'Generate leads for your business.',
    icon: <MdRecordVoiceOver size={50} color={LightThemeColors.uriColor} />,
    href: '/leads-tracking/forms',
  },
  {
    title: 'Alert',
    description: 'Get alerts based on your keywords.',
    icon: <PiBellRingingFill size={50} color={LightThemeColors.uriColor} />,
    href: '/alert?active_tab=mentions',
  },
  {
    title: 'Insight Assistant',
    description: 'Get insights and recommendations for your business.',
    icon: <BiBot size={50} color={LightThemeColors.uriColor} />,
    href: '/uri-assistant',
  },
];

const GlobalServices: React.FC = () => {
  const { open, setOpen } = useModal();
  const router = useRouter();

  return (
    <Container>
      <CustomModal open={open} closeOnOverlayClick closeModal={() => setOpen(false)} maxWidth="100vh" width="100vh" showCloseIcon>
        <ComingSoonComponent />
      </CustomModal>

      <HorizontalSlider variant="square" scrollThreshold={30}>
        {globalData.map((data, index) => (
          <Box
            key={data.title}
            sx={{
              marginLeft: index === 0 ? '40px' : '0',
              marginRight: index === globalData.length - 1 ? '40px' : '0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              width: 'fit-content',
              minWidth: { xs: '80%', md: '305px' },
              maxWidth: '305px', //'calc((100% - 20px * 2) / 3)',
              p: 3,
              borderRadius: '20px',
              boxShadow: '1px 1px 6px 3px #00000011',
              border: '2px solid white',
              borderColor: 'transparent',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                borderColor: '#CD1B78',
                borderRadius: '20px',
                scale: 1.02,
                '& .view-button': {
                  bgcolor: '#CD1B78',
                  '& .MuiTypography-root': {
                    color: 'white',
                  },
                },
              },
            }}
            className="group"
            style={{ scrollSnapAlign: 'start' }}
          >
            <div className="flex items-center justify-center rounded-full bg-primary-100 w-16 h-16">{data.icon}</div>
            <Typography variant="h6" className="text-center font-bold text-lg mt-2">
              {data.title}
            </Typography>
            <Typography variant="body1" className="text-center pb-3">
              {data.description}
            </Typography>
            <Button
              onClick={() => router.push(data?.href ?? '#')}
              className="mt-auto view-button"
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: 1.5,
                textDecoration: 'none',
                transition: 'all 0.3s ease-in-out',
              }}
            >
              <Typography sx={{ color: '#907382', fontWeight: 600 }}>View</Typography>
            </Button>
          </Box>
        ))}
      </HorizontalSlider>
    </Container>
  );
};

export default GlobalServices;
