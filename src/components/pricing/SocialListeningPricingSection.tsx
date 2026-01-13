import { SubscriptionPlanService } from '@/api/SubscriptionPlanService';
import { LightThemeColors } from '@/configs/colors.config';
import { NumberHelper } from '@/helpers/NumberHelper';
import { useSubscription } from '@/hooks/subscription/subscription.hook';
import { Box, Button, Card, CardContent, Chip, Grid, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useQuery } from '@tanstack/react-query';

const SocialListeningPricingSection = () => {
  const { initializeSubscription } = useSubscription();

  const { data: paidPlans } = useQuery({
    queryKey: ['social-listening-paid-monthly'],
    queryFn: async () => {
      const res = await SubscriptionPlanService.getSubscriptionPlans({
        pageNumber: 1,
        pageSize: 10,
        interval: 'monthly',
        plan_type: 'SOCIAL_LISTENING_PAID',
      });
      return res.responseData?.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: freePlans } = useQuery({
    queryKey: ['social-listening-free-monthly'],
    queryFn: async () => {
      const res = await SubscriptionPlanService.getSubscriptionPlans({
        pageNumber: 1,
        pageSize: 10,
        interval: 'monthly',
        plan_type: 'SOCIAL_LISTENING_FREE',
      });
      return res.responseData?.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const paidPlan = paidPlans?.[0];
  const freePlan = freePlans?.[0];
  const paidAmountNaira = Number(paidPlan?.amount ?? 0) / 100;

  const handleSubscribePaid = async () => {
    if (!paidPlan) return;
    const response: any = await initializeSubscription.mutateAsync({
      amount: Number(paidPlan.amount),
      plan: paidPlan.plan_code,
    });
    if (response?.authorization_url) {
      window.location.href = response.authorization_url;
    }
  };

  const handleSubscribeFree = async () => {
    if (!freePlan) return;
    try {
      await initializeSubscription.mutateAsync({
        amount: 0,
        plan: freePlan.plan_code,
      });
      window.location.assign('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box sx={{ py: 6 }}>
      <Box textAlign="center" mb={5}>
        <Chip
          label="SOCIAL LISTENING"
          sx={{
            backgroundColor: alpha(LightThemeColors.uriColor, 0.1),
            color: LightThemeColors.uriColor,
            fontWeight: 700,
            mb: 2,
          }}
        />
        <Typography variant="h4" fontWeight={800} sx={{ color: '#141414', mb: 1 }}>
          Free and Paid Plans
        </Typography>
        <Typography variant="body1" sx={{ color: '#6B6B6B', maxWidth: 600, mx: 'auto' }}>
          Choose Social Listening Free to explore, or upgrade to Paid for more reports and accounts.
        </Typography>
      </Box>

      <Grid container spacing={4} sx={{ pt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderRadius: 4,
              height: '100%',
              border: '2px solid #e0e0e0',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>
                Social Listening Free
              </Typography>
              <Typography variant="body2" sx={{ color: '#6B6B6B', mb: 2 }}>
                Access to Dera AI, 1 report per month, 1 connected social account
              </Typography>
              <Typography variant="h6" fontWeight={800} sx={{ color: '#141414', mb: 3 }}>
                ₦0 / month
              </Typography>
              <Button variant="outlined" onClick={handleSubscribeFree} disabled={!freePlan || initializeSubscription.isPending} sx={{ borderRadius: 2 }}>
                {initializeSubscription.isPending ? 'Processing...' : 'Get Started Free'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderRadius: 4,
              height: '100%',
              border: `2px solid ${LightThemeColors.uriColor}`,
              transition: 'all 200ms ease',
              '&:hover': {
                boxShadow: `0 8px 32px ${alpha(LightThemeColors.uriColor, 0.2)}`,
              },
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>
                Social Listening Paid
              </Typography>
              <Typography variant="body2" sx={{ color: '#6B6B6B', mb: 2 }}>
                4 reports per month, 3 connected social accounts, Dera AI access
              </Typography>
              <Typography variant="h6" fontWeight={800} sx={{ color: '#141414', mb: 3 }}>
                ₦{NumberHelper.formatNumber(paidAmountNaira || 0)} / month
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button variant="contained" onClick={handleSubscribePaid} disabled={!paidPlan} sx={{ borderRadius: 2 }}>
                  {paidPlan ? 'Subscribe' : 'Loading plan...'}
                </Button>
                <Button variant="outlined" onClick={() => window.open('/features', '_blank')} sx={{ borderRadius: 2 }}>
                  Learn More
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SocialListeningPricingSection;
