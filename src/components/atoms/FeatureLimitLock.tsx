import LockedContent from '@/components/atoms/LockedContent';
import { LightThemeColors } from '@/configs/colors.config';
import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import { FaExclamationTriangle } from 'react-icons/fa';

const FeatureLimitLock = () => {
  const router = useRouter();
  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh" // This will ensure full viewport height
      >
        <LockedContent
          title="Your Plan does not include this feature"
          description="Please upgrade your plan to access this feature."
          icon={<FaExclamationTriangle size={30} color={LightThemeColors.uriColor} />}
          showBtn
          btnText="Go back"
          btnProps={{
            onClick: () => router.back(),
          }}
        />
      </Box>
    </>
  );
};

export default FeatureLimitLock;
