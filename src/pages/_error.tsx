import { Box, useMediaQuery } from '@mui/material';
import { NextPage, NextPageContext } from 'next';

import CustomButton from '@/components/atoms/CustomButton';
import Text from '@/components/atoms/CustomText';
import DashboardLayout from '@/components/atoms/DashboardLayout';
import SeoHead from '@/components/atoms/SeoHead';
import SubscriptionModal from '@/components/modals/SubscriptionModal';
import { useRouter } from 'next/router';

interface Props {
  statusCode?: number;
}

const Error: NextPage<Props> = ({ statusCode }) => {
  const matches = useMediaQuery('(max-width: 500px)');
  const route = useRouter();
  const handleReturn = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      route.back();
    } else {
      route.push('/');
    }
  };

  if (statusCode === 404) {
    return (
      <>
        <SeoHead title="Page Not Found" />
        <Box height={'80svh'}>
          <Box display="flex" flexDirection="column" alignItems="center" height={'100%'} justifyContent={'center'}>
            <Text size={matches ? 80 : 120} weight={800}>
              404
            </Text>
            <Text size={16} weight={500}>
              This page you were looking for was either removed or doesn{"'"}t exist
            </Text>
            <Box width={'300px'} mt={2}>
              <CustomButton mode="primary" onClick={handleReturn}>
                Return
              </CustomButton>
            </Box>
          </Box>
        </Box>
      </>
    );
  }

  if (statusCode === 402) {
    return (
      <>
        <SeoHead title="Payment Required" />
        <SubscriptionModal />
      </>
    );
  }

  return (
    <>
      <SeoHead title="Error" />
      <DashboardLayout>
        <Box height={'80svh'}>
          <Box display="flex" flexDirection="column" alignItems="center" height={'100%'} justifyContent={'center'} gap={'12px'}>
            <Text size={matches ? 80 : 120} weight={800}>
              Oops!
            </Text>
            <Text size={16} weight={500}>
              Something went wrong
            </Text>
            <Box width={'300px'}>
              <CustomButton mode="primary" onClick={() => route.push('/dashboard')}>
                Go to Dashboard
              </CustomButton>
            </Box>
          </Box>
        </Box>
      </DashboardLayout>
    </>
  );
};

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
