import { LightThemeColors } from '@/configs/colors.config';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';

const LeadSearchHeader = () => {
  return (
    <Box
      sx={{
        backgroundColor: LightThemeColors.uriColor,
        borderRadius: 3,
        px: 4,
        py: 3,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        color: '#fff',
      }}
    >
      <Box flex={1}>
        <Typography fontWeight={700} fontSize="20px" mb={1}>
          Ready to find the right leads?
        </Typography>
        <Typography fontSize="14px">Select a lead category, add your keywords, and personalize your input fields. We’ll handle the rest from tracking to lead alerts.</Typography>
      </Box>
      <Box>
        {/* You can replace this with your own illustration */}
        <Image src={'/assets/images/find-leads.png'} alt="Lead Illustration" width={120} height={120} />
      </Box>
    </Box>
  );
};

export default LeadSearchHeader;
