import { Box, Typography } from '@mui/material';
import { FaFacebook, FaInstagram, FaTiktok, FaTwitter, FaYoutube } from 'react-icons/fa';

// Custom styles for platform icons and metrics
const platformMetrics = [
  {
    name: 'Facebook',
    icon: <FaFacebook color="#4267B2" size={32} />,
    metric: '1,898',
    mentionRate: '31.76%',
  },
  {
    name: 'Twitter',
    icon: <FaTwitter color="#1DA1F2" size={32} />,
    metric: '946',
    mentionRate: '15.82%',
  },
  {
    name: 'Instagram',
    icon: <FaInstagram color="#E1306C" size={32} />,
    metric: '1,835',
    mentionRate: '30.70%',
  },
  {
    name: 'TikTok',
    icon: <FaTiktok color="#69C9D0" size={32} />,
    metric: '1,298',
    mentionRate: '21.72%',
  },
  {
    name: 'YouTube',
    icon: <FaYoutube color="#FF0000" size={32} />,
    metric: '2,354',
    mentionRate: 'Videos',
  },
];

// Component
const PlatformMetrics = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        mt: 4,
        bgcolor: '#f9f9f9',
        borderRadius: 1,
        p: 2,
        overflow: 'auto',
      }}
    >
      {platformMetrics.map((platform, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            border: '1px solid #ddd',
            borderRadius: 1,
            p: 2,
            minWidth: '150px',
            textAlign: 'center',
            mx: 1,
          }}
        >
          {platform.icon}
          <Typography variant="h5" fontWeight="bold" mt={1}>
            {platform.metric}
          </Typography>
          <Typography variant="subtitle1">{platform.name}</Typography>
          <Typography variant="caption" color="textSecondary">
            Mentions: {platform.mentionRate}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default PlatformMetrics;
