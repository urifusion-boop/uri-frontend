import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { Box, Grid, Link, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';

interface LowerFooterProps {
  toggleTAndC: () => void;
}

const LowerFooter: React.FC<LowerFooterProps> = ({ toggleTAndC }) => {
  const router = useRouter();

  return (
    <Box
      sx={{
        backgroundImage: 'url("https://example.com/sample-image.jpg")', // Replace with actual image URL
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // White background overlay
        color: '#333333', // Dark text color for contrast on white
        padding: '1.5rem 4rem',
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
      <Grid container alignItems="center" className="container" justifyContent="space-between" spacing={4} sx={{ position: 'relative', zIndex: 3, maxWidth: '1580px', margin: '0 auto' }}>
        {/* Logo and Terms Section */}
        <Grid item xs={12} md={6}>
          <Box display="flex" alignItems="center" gap="2rem" flexWrap="wrap">
            <Box display="flex" alignItems="center" gap="1rem" flexWrap="wrap">
              <Link href="#" color="inherit" underline="hover" sx={{ fontSize: '0.875rem', color: '#333333' }} onClick={toggleTAndC}>
                <Typography>Terms of Use</Typography>
              </Link>
              <Link href="/faqs" color="inherit" underline="hover" sx={{ fontSize: '0.875rem', color: '#333333' }}>
                <Typography>Faqs</Typography>
              </Link>

              <Link href="/privacy-policy" color="inherit" underline="hover" sx={{ fontSize: '0.875rem', color: '#333333' }}>
                <Typography>Privacy Policy</Typography>
              </Link>
              {/* <Link
                href="#"
                color="inherit"
                underline="hover"
                sx={{ fontSize: "0.875rem", color: "#333333" }}
              >
                Trademarks
              </Link> */}
              {/* <Link
                href="#"
                color="inherit"
                underline="hover"
                sx={{ fontSize: "0.875rem", color: "#333333" }}
              >
                License Agreements
              </Link> */}
            </Box>
          </Box>
          <Typography variant="body2" color="textSecondary" sx={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#666666' }}>
            {`© ${new Date().getFullYear()} Uri Creative. All Rights Reserved.`}
          </Typography>
        </Grid>

        {/* Social Media Icons and Powered By */}
        <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'center', md: 'right' } }}>
          <Box display="flex" justifyContent={{ xs: 'center', md: 'flex-end' }} gap="1.5rem" mb={1}>
            <a href="https://www.facebook.com/share/p/Cn19gyDHqVNni2ca/" target="_blank" rel="noopener noreferrer">
              <FacebookIcon sx={{ color: '#333333', cursor: 'pointer' }} />
            </a>
            <a href="https://x.com/uricreative" target="_blank" rel="noopener noreferrer">
              <TwitterIcon sx={{ color: '#333333', cursor: 'pointer' }} />
            </a>
            <a href="https://www.youtube.com/@UriCreative" target="_blank" rel="noopener noreferrer">
              <YouTubeIcon sx={{ color: '#333333', cursor: 'pointer' }} />
            </a>
            <a href="https://www.linkedin.com/company/uri-creative/" target="_blank" rel="noopener noreferrer">
              <LinkedInIcon sx={{ color: '#333333', cursor: 'pointer' }} />
            </a>
          </Box>
          {/* <Typography
            variant="caption"
            sx={{ fontSize: "0.75rem", color: "#666666" }}
          >
            Powered by{" "}
            <Link
              href="#"
              sx={{
                color: "#007bb5",
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              Progress Sitefinity
            </Link>
          </Typography> */}
        </Grid>
      </Grid>
    </Box>
  );
};

export default LowerFooter;
