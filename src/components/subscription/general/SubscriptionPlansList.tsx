import { LightThemeColors } from '@/configs/colors.config';
import { SubscriptionTypeEnum } from '@/models/enum-models/SubscriptionStatusEnum';
import { alpha, Box, Button, Card, CardContent, Chip, Grid, List, ListItem, ListItemIcon, ListItemText, Stack, Typography } from '@mui/material';
import { FaBuilding, FaCheck, FaCoins, FaHandshake, FaHeadphones, FaWallet } from 'react-icons/fa';
import { MdTimer } from 'react-icons/md';

interface PlanCardProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  isHighlighted?: boolean;
  badge?: string;
  actionLabel?: string;
  onAction?: () => void;
  isActive?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
  comingSoon?: boolean;
}

const PlanCard = ({ icon, iconBg, title, subtitle, description, features, isHighlighted, badge, actionLabel, onAction, isActive, isLoading, isDisabled, comingSoon }: PlanCardProps) => {
  const activeBorderColor = '#16a34a';
  const disabledStyles = isDisabled || comingSoon;

  return (
    <Card
      sx={{
        borderRadius: 4,
        height: '100%',
        border: isActive ? `2px solid ${activeBorderColor}` : isHighlighted && !disabledStyles ? `2px solid ${LightThemeColors.uriColor}` : '1px solid #e0e0e0',
        position: 'relative',
        overflow: 'visible',
        transition: 'all 200ms ease',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: isActive ? alpha(activeBorderColor, 0.02) : disabledStyles ? '#fafafa' : 'white',
        opacity: disabledStyles ? 0.7 : 1,
        '&:hover': {
          transform: disabledStyles ? 'none' : 'translateY(-4px)',
          boxShadow: disabledStyles
            ? 'none'
            : isActive
              ? `0 12px 40px ${alpha(activeBorderColor, 0.2)}`
              : isHighlighted
                ? `0 12px 40px ${alpha(LightThemeColors.uriColor, 0.2)}`
                : '0 12px 40px rgba(0,0,0,0.1)',
        },
      }}
    >
      {comingSoon && (
        <Chip
          label="COMING SOON"
          size="small"
          sx={{
            position: 'absolute',
            top: -10,
            right: 16,
            backgroundColor: '#6B6B6B',
            color: 'white',
            fontWeight: 800,
            fontSize: 10,
          }}
        />
      )}
      {isActive && !comingSoon && (
        <Chip
          icon={<FaCheck size={10} />}
          label="ACTIVE"
          size="small"
          sx={{
            position: 'absolute',
            top: -10,
            right: 16,
            backgroundColor: activeBorderColor,
            color: 'white',
            fontWeight: 800,
            fontSize: 10,
            '& .MuiChip-icon': {
              color: 'white',
            },
          }}
        />
      )}
      {badge && !isActive && !comingSoon && (
        <Chip
          label={badge}
          size="small"
          sx={{
            position: 'absolute',
            top: -10,
            right: 16,
            backgroundColor: LightThemeColors.uriColor,
            color: 'white',
            fontWeight: 800,
            fontSize: 10,
          }}
        />
      )}
      <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Stack spacing={2} flex={1}>
          {/* Header */}
          <Stack direction="row" alignItems="center" gap={2}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: iconBg,
                color: 'white',
                flexShrink: 0,
              }}
            >
              {icon}
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={800} sx={{ color: '#141414', lineHeight: 1.2 }}>
                {title}
              </Typography>
              <Typography variant="caption" sx={{ color: '#6B6B6B', fontWeight: 600 }}>
                {subtitle}
              </Typography>
            </Box>
          </Stack>

          {/* Description */}
          <Typography variant="body2" sx={{ color: '#6B6B6B', lineHeight: 1.5, fontSize: '13px' }}>
            {description}
          </Typography>

          {/* Features */}
          <List dense sx={{ flex: 1, p: 0 }}>
            {features.map((feature, index) => (
              <ListItem key={index} sx={{ px: 0, py: 0.25 }}>
                <ListItemIcon sx={{ minWidth: 24 }}>
                  <FaCheck size={10} color="#27ae60" />
                </ListItemIcon>
                <ListItemText
                  primary={feature}
                  primaryTypographyProps={{
                    variant: 'body2',
                    sx: { color: '#4a4a4a', fontWeight: 500, fontSize: '12px' },
                  }}
                />
              </ListItem>
            ))}
          </List>

          {/* Action Button */}
          {actionLabel && (
            <Button
              variant={isActive ? 'contained' : isHighlighted && !disabledStyles ? 'contained' : 'outlined'}
              fullWidth
              onClick={onAction}
              disabled={!onAction || isActive || isLoading || isDisabled || comingSoon}
              sx={{
                mt: 'auto',
                borderRadius: 2.5,
                textTransform: 'none',
                fontWeight: 700,
                py: 1,
                borderColor: isActive ? '#16a34a' : LightThemeColors.uriColor,
                color: isActive ? 'white' : isHighlighted && !disabledStyles ? 'white' : LightThemeColors.uriColor,
                backgroundColor: isActive ? '#16a34a' : isHighlighted && !disabledStyles ? LightThemeColors.uriColor : 'transparent',
                '&:hover': {
                  borderColor: isActive ? '#16a34a' : LightThemeColors.uriColor,
                  backgroundColor: isActive ? '#16a34a' : isHighlighted && !disabledStyles ? alpha(LightThemeColors.uriColor, 0.9) : alpha(LightThemeColors.uriColor, 0.05),
                  color: isActive ? 'white' : isHighlighted && !disabledStyles ? 'white' : LightThemeColors.uriColor,
                  boxShadow: isActive ? 'none' : isHighlighted && !disabledStyles ? `0 4px 12px ${alpha(LightThemeColors.uriColor, 0.3)}` : 'none',
                },
                '&.Mui-disabled': {
                  borderColor: isActive ? '#16a34a' : '#e0e0e0',
                  color: isActive ? 'white' : '#9e9e9e',
                  backgroundColor: isActive ? '#16a34a' : '#f5f5f5',
                  opacity: isActive ? 1 : 0.7,
                },
              }}
            >
              {isLoading ? 'Processing...' : isActive ? 'Current Plan' : comingSoon ? 'Coming Soon' : actionLabel}
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

interface SubscriptionPlansListProps {
  onSelectPlan: (planType: string, planCode: string, amount?: number) => void;
  currentPlanType?: string;
  isLoading?: boolean;
  loadingPlanType?: string;
}

const SubscriptionPlansList = ({ onSelectPlan, currentPlanType, isLoading, loadingPlanType }: SubscriptionPlansListProps) => {
  const plans: (PlanCardProps & { planType: string; planCode: string; amount?: number })[] = [
    {
      planType: SubscriptionTypeEnum.FreeTrial,
      planCode: 'FREE_TRIAL',
      amount: 0,
      icon: <MdTimer size={20} />,
      iconBg: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)',
      title: 'Trial User',
      subtitle: '30 days free',
      description: 'New to Uri? Start with our free trial to explore all premium features before committing.',
      features: ['30-day full access trial', 'All social listening features', 'Limited lead generation', 'Upgrade prompts when limits hit'],
      badge: 'NEW USERS',
    },
    {
      planType: SubscriptionTypeEnum.SocialListeningFree,
      planCode: 'SOCIAL_LISTENING_FREE_MONTHLY',
      icon: <FaHeadphones size={18} />,
      iconBg: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
      title: 'Free Social Listening',
      subtitle: 'Basic monitoring',
      description: 'Perfect for individuals who want to monitor social presence with optional lead gen access.',
      features: ['1 social account tracking', '1 report per month', 'Access to Dera AI assistant', 'PAYG or credits for leads'],
    },
    {
      planType: SubscriptionTypeEnum.SocialListeningPaid,
      planCode: 'SOCIAL_LISTENING_PAID_MONTHLY',
      amount: 1000000,
      icon: <FaHandshake size={18} />,
      iconBg: 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)',
      title: 'Social Listening (Paid)',
      subtitle: 'Pro monitoring',
      description: 'For growing brands that need more comprehensive social tracking and reporting.',
      features: ['3 social accounts tracking', '4 reports per month', 'Access to Dera AI assistant', 'Enhanced tracking capabilities'],
      comingSoon: false,
    },
    {
      planType: SubscriptionTypeEnum.Enterprise,
      planCode: 'ENTERPRISE',
      icon: <FaBuilding size={18} />,
      iconBg: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
      title: 'Enterprise',
      subtitle: 'Unlimited access',
      description: 'The ultimate solution for large organizations requiring unlimited capabilities.',
      features: ['Unlimited social accounts', 'Unlimited reports', 'Full AI capabilities', 'Priority support & collaboration'],
      comingSoon: true,
    },
    {
      planType: SubscriptionTypeEnum.LeadsGen,
      planCode: 'LEADS_GEN_MONTHLY',
      icon: <FaWallet size={18} />,
      iconBg: 'linear-gradient(135deg, #27ae60 0%, #219a52 100%)',
      title: 'PAYG Lead Gen',
      subtitle: 'Pay as you go',
      description: 'Flexible payment for lead generation. Fund your wallet and pay only for what you use.',
      features: ['Fund wallet (min ₦5,000)', 'Pay per scan & lead action', 'No commitment required', 'Instant deductions'],
    },
    {
      planType: 'CREDIT_BUNDLES',
      planCode: 'CREDIT_BUNDLES',
      icon: <FaCoins size={18} />,
      iconBg: `linear-gradient(135deg, ${LightThemeColors.uriColor} 0%, #B8186A 100%)`,
      title: 'Credit Bundles',
      subtitle: 'Best value',
      description: 'Buy credit bundles upfront for the best per-action pricing. Ideal for power users.',
      features: ['Up to 10% savings vs PAYG', 'Bundles from 10-150 credits', 'Credits never expire', 'Discounted enrichment costs'],
      isHighlighted: true,
      comingSoon: true,
    },
  ];

  return (
    <Box sx={{ py: 2 }}>
      {/* Section Header */}
      <Box textAlign="center" mb={4}>
        <Chip
          label="CHOOSE YOUR PATH"
          sx={{
            backgroundColor: alpha('#9b59b6', 0.1),
            color: '#9b59b6',
            fontWeight: 700,
            mb: 2,
          }}
        />
        <Typography variant="h5" fontWeight={800} sx={{ color: '#141414', mb: 1 }}>
          Find Your Perfect Fit
        </Typography>
        <Typography variant="body2" sx={{ color: '#6B6B6B', maxWidth: 500, mx: 'auto' }}>
          Whether you&apos;re exploring or scaling, we have a plan that fits your needs and budget.
        </Typography>
      </Box>

      {/* Plan Cards Grid */}
      <Grid container spacing={2.5} sx={{ pt: 1 }}>
        {plans.map((plan) => {
          const isPlanActive = currentPlanType === plan.planType;
          const isPlanLoading = isLoading && loadingPlanType === plan.planType;

          return (
            <Grid item xs={12} sm={6} md={4} key={plan.planCode}>
              <PlanCard
                icon={plan.icon}
                iconBg={plan.iconBg}
                title={plan.title}
                subtitle={plan.subtitle}
                description={plan.description}
                features={plan.features}
                isHighlighted={plan.isHighlighted}
                badge={plan.badge}
                actionLabel={plan.planType === 'CREDIT_BUNDLES' ? 'Buy Credits' : 'Choose Plan'}
                onAction={() => onSelectPlan(plan.planType, plan.planCode, plan.amount)}
                isActive={isPlanActive}
                isLoading={isPlanLoading}
                comingSoon={plan.comingSoon}
              />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default SubscriptionPlansList;
