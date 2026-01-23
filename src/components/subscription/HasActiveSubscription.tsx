import { Box, Button, Pagination, Typography } from '@mui/material';
import { useMemo, useState } from 'react';

import { NumberHelper } from '@/helpers/NumberHelper';
import { TextHelper } from '@/helpers/TextHelper';
import { useSubscriptionHistory } from '@/hooks/subscription/subscriptionHistory';
import { FeatureLimitDto } from '@/models/dtos/FeatureLimitDto';
import { PaystackSubscriptionDto } from '@/models/dtos/SubscriptionDto';
import { SubscriptionTypeEnum } from '@/models/enum-models/SubscriptionStatusEnum';
import { useAuth } from '@/providers/AuthProvider';
import dayjs from 'dayjs';
import { BiX } from 'react-icons/bi';
import SmartModal from '../modals/SmartModal';
import SubscriptionsTable from './SubscriptionsTable';

interface HasActiveSubscriptionProps {
  featureLimit: FeatureLimitDto;
}

const HasActiveSubscription = ({ featureLimit }: HasActiveSubscriptionProps) => {
  const [cancelSubscriptionConfirmationModal, setCancelSubscriptionConfirmationModal] = useState(false);

  const [cancelSubscriptionSuccessModal, setCancelSubscriptionSuccessModal] = useState(false);

  const { subscriptionHistory, isLoadingSubscriptionHistory, page, setPage, disableSubscriptionMutation } = useSubscriptionHistory();
  const { userDetails } = useAuth();

  const hasPlan = featureLimit.subscriptionStatus === 'ACTIVE';
  const isSocialListeningFree = featureLimit.subscriptionPlan === SubscriptionTypeEnum.SocialListeningFree;

  const activePaystackSubscription = useMemo(
    () =>
      subscriptionHistory?.data?.find((subscription: PaystackSubscriptionDto) => {
        const status = subscription?.status?.toLowerCase();
        return status === 'active' || status === 'non-renewing';
      }),
    [subscriptionHistory]
  );

  const joinedDate = useMemo(() => {
    const raw = (featureLimit as any).created_at ?? (featureLimit as any).createdAt ?? userDetails?.dateCreated;
    return raw ? dayjs(raw).format('MMMM YYYY ') : '';
  }, [featureLimit, userDetails?.dateCreated]);

  const planDisplayName = isSocialListeningFree ? 'Social Listening Free' : TextHelper.removeChar(featureLimit.subscriptionPlan ?? '', '_');

  const amountValue = isSocialListeningFree ? 0 : (activePaystackSubscription?.amount ?? 0) / 100;
  const intervalLabel = isSocialListeningFree ? 'monthly' : (activePaystackSubscription?.plan?.interval ?? 'monthly');

  return (
    <>
      <Box
        sx={{
          maxWidth: '930px',
          width: '100%',
          margin: 'auto',
          borderRadius: '12px',
          backgroundColor: '#fff',
          py: '24px',
          boxShadow: '-1px -1px 10px 2px #0000000D',
          px: {
            xs: '28px',
            md: '40px',
          },
        }}
      >
        <Typography
          sx={{
            fontSize: 'clamp(1.375rem, 1.3232rem + 0.221vw, 1.5rem)',
            fontWeight: 600,
            color: '#000000',
            mb: '6px',
          }}
        >
          Manage Subscription
        </Typography>
        <Typography
          sx={{
            fontSize: '18px',
            fontWeight: 500,
            color: '#3B3B3B',
          }}
        >
          Easily manage your subscription preferences, update your plan, or cancel anytime.
        </Typography>

        {/* Current Plan */}
        {hasPlan ? (
          <Box
            sx={{
              maxWidth: '629px',
              width: '100%',
              borderRadius: '10px',
              boxShadow: '2px -1px 10px 4px #0000000D',
              mt: '50px',
              p: {
                xs: '24px',
                md: '32px',
              },
            }}
          >
            <Typography
              sx={{
                fontSize: 'clamp(1.375rem, 1.3232rem + 0.221vw, 1.5rem)',
                fontWeight: 600,
                color: '#141416',
                mb: '6px',
              }}
            >
              Current Plan
            </Typography>

            {isSocialListeningFree && (
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  mt: 1,
                  px: '10px',
                  py: '4px',
                  borderRadius: '999px',
                  backgroundColor: '#E6F4EA',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#166534',
                  }}
                >
                  Social Listening Free • Active
                </Typography>
              </Box>
            )}

            {/* Plan details */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', md: 'center' },
                flexDirection: { xs: 'column', md: 'row' },
                gap: '16px',
              }}
            >
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '16px',
                      fontWeight: 500,
                      color: '#FFF',
                      backgroundColor: '#CD1B78',
                      padding: '3px 4px',
                      borderRadius: '4px',
                    }}
                  >
                    {planDisplayName}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#141416',
                    }}
                  >
                    Plan
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#6C727F',
                  }}
                >
                  Joined {joinedDate || '—'}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '64px',
                    fontWeight: 800,
                    color: '#141416',
                  }}
                >
                  {NumberHelper.formatNumber(amountValue)}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '24px',
                    fontWeight: 600,
                    color: '#363636',
                  }}
                >
                  /{intervalLabel}
                </Typography>
              </Box>
            </Box>

            {/*Next Payment Details  */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', md: 'center' },
                flexDirection: { xs: 'column', md: 'row' },
                mt: '24px',
                gap: '16px',
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#6C727F',
                  }}
                >
                  Next Payment
                </Typography>
                <Typography
                  sx={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#141416',
                  }}
                >
                  {!activePaystackSubscription?.next_payment_date ? 'No upcoming payments' : dayjs(activePaystackSubscription.next_payment_date).format('MMM DD, YYYY')}
                </Typography>
              </Box>
            </Box>

            {/* CTA */}
            {activePaystackSubscription && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mt: '24px',
                  alignItems: { xs: 'flex-start', md: 'center' },
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: '16px',
                }}
              >
                <Button
                  variant="outlined"
                  sx={{
                    px: '61px',
                    width: { xs: '100%', md: 'auto' },
                  }}
                  onClick={() => setCancelSubscriptionConfirmationModal(true)}
                >
                  Cancel Subscription
                </Button>
                {/* <Button
            variant="contained"
            sx={{
              px: "61px",
              width: { xs: "100%", md: "auto" },
            }}
          >
            Change Plan
          </Button> */}
              </Box>
            )}
          </Box>
        ) : (
          <Box
            sx={{
              maxWidth: '500px',
              width: '100%',
              borderRadius: '12px',
              backgroundColor: '#fff',
              py: '24px',
              boxShadow: '-1px -1px 10px 2px #0000000D',
              px: {
                xs: '28px',
                md: '40px',
              },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '200px',
              mt: 2,
            }}
          >
            <Typography
              sx={{
                fontSize: 'clamp(1.375rem, 1.3232rem + 0.221vw, 1.5rem)',
                fontWeight: 600,
                color: '#000000',
                mb: '6px',
              }}
            >
              No Active Subscription
            </Typography>
          </Box>
        )}

        {/* Subscription History */}
        <Box
          sx={{
            boxShadow: '0.93px -0.93px 9.27px 3.71px #0000000D',
            backgroundColor: '#FAFAFA33',
            p: {
              xs: '24px',
              md: '32px',
            },
            width: '100%',
            borderRadius: '10px',
            mt: '50px',
          }}
        >
          {/* Title */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', md: 'center' },
              flexDirection: { xs: 'column', md: 'row' },
              gap: '16px',
            }}
          >
            <Typography
              sx={{
                color: '#212529',
                fontSize: 'clamp(1.375rem, 1.1937rem + 0.7735vw, 1.8125rem)',
                fontWeight: 600,
              }}
            >
              Billing History
            </Typography>
            {/* <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <OutlinedInput
                id="outlined-adornment-weight"
                placeholder="Search"
                startAdornment={
                  <InputAdornment position="start">
                    <IoIosSearch size={14} color="#4E4E4E" />
                  </InputAdornment>
                }
                sx={{
                  height: "32px",
                  maxWidth: "218px",
                  fontSize: "14px",
                  "& .MuiOutlinedInput-input": {
                    padding: "6px 8px",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#ccc",
                  },
                }}
              />
              <OutlinedInput
                id="outlined-adornment-weight"
                placeholder="Filter"
                startAdornment={
                  <InputAdornment position="start">
                    <LiaSlidersHSolid size={14} color="#4E4E4E" />
                  </InputAdornment>
                }
                sx={{
                  height: "32px",
                  maxWidth: "100px",
                  fontSize: "14px",
                  "& .MuiOutlinedInput-input": {
                    padding: "6px 8px",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#ccc",
                  },
                }}
              />
              <OutlinedInput
                id="outlined-adornment-weight"
                placeholder="Export"
                startAdornment={
                  <InputAdornment position="start">
                    <PiExportBold size={14} color="#4E4E4E" />
                  </InputAdornment>
                }
                sx={{
                  height: "32px",
                  maxWidth: "100px",
                  fontSize: "14px",
                  "& .MuiOutlinedInput-input": {
                    padding: "6px 8px",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#ccc",
                  },
                }}
              />
            </Box> */}
          </Box>

          {/* Table */}
          <SubscriptionsTable transactionHistory={subscriptionHistory?.data ?? []} loading={isLoadingSubscriptionHistory} />

          {/* Pagination */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <Pagination count={Math.ceil((Number(subscriptionHistory?.pageSize) ?? 0) / 5)} page={page} onChange={(_, page) => setPage(page)} color="primary" sx={{ mt: '24px' }} />
          </Box>
        </Box>
      </Box>

      {/* Cancel confirmation modal */}
      <SmartModal
        open={cancelSubscriptionConfirmationModal}
        mainText="Cancel Subscription"
        subText="You'll lose access after your billing cycle ends. You can resubscribe anytime."
        onClick={() => {
          if (!activePaystackSubscription?.subscription_code || !activePaystackSubscription?.email_token) return;
          disableSubscriptionMutation.mutate(
            {
              code: activePaystackSubscription?.subscription_code,
              token: activePaystackSubscription?.email_token,
            },
            {
              onSuccess: () => {
                setCancelSubscriptionSuccessModal(true);
                setCancelSubscriptionConfirmationModal(false);
              },
              onError: () => {
                setCancelSubscriptionConfirmationModal(false);
              },
            }
          );
        }}
        image={
          <Box
            sx={{
              backgroundColor: '#FFC4C442',
              borderRadius: '50%',
              height: '79px',
              width: '79px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <BiX color="#A9302D" size={55} />
          </Box>
        }
        buttonText="Cancel"
        onOutlineButtonClick={() => setCancelSubscriptionConfirmationModal(false)}
        loading={disableSubscriptionMutation.isLoading}
        outlineButtonText="Keep"
      />

      {/* Cancel confirmation modal */}
      <SmartModal
        open={cancelSubscriptionSuccessModal}
        mainText="Subscription Canceled"
        subText="Once this billing cycle ends, you’ll no longer have access."
        onClick={() => setCancelSubscriptionSuccessModal(false)}
        image={<img src="/assets/images/success.png" alt="success-icon" width={100} height={100} />}
        buttonText="Okay"
      />
    </>
  );
};

export default HasActiveSubscription;
