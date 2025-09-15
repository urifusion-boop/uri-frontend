import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Avatar, Box, Button, IconButton, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
interface InfluencerHeaderProps {
  name: string;
  biography: string;
  avatarUrl: string;
  status: string;
  website: string;
}

const InfluencerHeader = ({ name, biography, avatarUrl, status, website }: InfluencerHeaderProps) => {
  const navigation = useRouter();
  const [expanded, setExpanded] = useState(false);
  const MAX_LENGTH = 250;

  const toggleExpanded = () => {
    setExpanded((prev) => !prev);
  };

  const shouldTruncate = biography && biography.length > MAX_LENGTH;
  const displayText = shouldTruncate && !expanded ? biography.slice(0, MAX_LENGTH) + '...' : biography;

  return (
    <Box
      display={'grid'}
      gridTemplateColumns={'1fr auto'}
      mb={4}
      mt={4}
      p={2}
      borderRadius={2}
      bgcolor="#f8f9fa" // Light background similar to the screenshot
    >
      <Box display="flex" alignItems="center">
        <IconButton onClick={() => navigation.back()}>
          <ArrowBackIosNewIcon sx={{ fontSize: 18, color: '#333' }} />
        </IconButton>
        <Avatar
          src={avatarUrl}
          sx={{ width: 48, height: 48, mr: 2 }} // Adjust avatar size and spacing
        />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            {name}
          </Typography>

          <Box
            sx={{
              maxWidth: '700px',
              wordWrap: 'break-word',
              whiteSpace: 'pre-line',
            }}
          >
            <Typography variant="body2" color="textSecondary" component="span">
              {displayText ?? 'No bio'}
            </Typography>
            {shouldTruncate && (
              <Button
                size="small"
                onClick={toggleExpanded}
                sx={{
                  textTransform: 'none',
                  fontSize: '0.5rem',
                  ml: 1,
                  padding: 0,
                  minWidth: 'auto',
                }}
              >
                {expanded ? 'Read Less' : 'Read More'}
              </Button>
            )}
          </Box>

          {/* Website section */}
          <Box
            mt={2}
            display="flex"
            sx={{
              flexDirection: {
                xs: 'column',
                sm: 'row',
              },
              alignItems: {
                xs: 'flex-start',
                sm: 'center',
              },
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mr: 1 }}>
              Website:
            </Typography>
            {website && website.length > 0 ? (
              <Typography
                variant="body2"
                component="a"
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'primary.main', // Use the theme's primary color for hyperlink
                  textDecoration: 'underline',
                  maxWidth: '400px',
                  wordWrap: 'break-word',
                }}
              >
                {website}
              </Typography>
            ) : (
              <Typography variant="body2" color="textSecondary">
                N/A
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default InfluencerHeader;
