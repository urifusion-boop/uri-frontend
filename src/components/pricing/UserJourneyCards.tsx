import { LightThemeColors } from '@/configs/colors.config';
import { alpha, Box, Button, Card, CardContent, Chip, Grid, List, ListItem, ListItemIcon, ListItemText, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { FaBuilding, FaCheck, FaCoins, FaHandshake, FaHeadphones, FaWallet } from 'react-icons/fa';
import { MdTimer } from 'react-icons/md';

interface UserTypeCardProps {
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
  comingSoon?: boolean;
}

const UserTypeCard = ({ icon, iconBg, title, subtitle, description, features, isHighlighted, badge, actionLabel, onAction, isActive, comingSoon }: UserTypeCardProps) => {
  const activeBorderColor = '#16a34a';
  const disabledStyles = comingSoon;

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
        <Stack spacing={2.5} flex={1}>
          {/* Header */}
          <Stack direction="row" alignItems="center" gap={2}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: iconBg,
                color: 'white',
              }}
            >
              {icon}
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={800} sx={{ color: '#141414', lineHeight: 1.2 }}>
                {title}
              </Typography>
              <Typography variant="caption" sx={{ color: '#6B6B6B', fontWeight: 600 }}>
                {subtitle}
              </Typography>
            </Box>
          </Stack>

          {/* Description */}
          <Typography variant="body2" sx={{ color: '#6B6B6B', lineHeight: 1.6 }}>
            {description}
          </Typography>

          {/* Features */}
          <List dense sx={{ flex: 1 }}>
            {features.map((feature, index) => (
              <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 28 }}>
                  <FaCheck size={12} color="#27ae60" />
                </ListItemIcon>
                <ListItemText
                  primary={feature}
                  primaryTypographyProps={{
                    variant: 'body2',
                    sx: { color: '#4a4a4a', fontWeight: 500 },
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
              disabled={!onAction || isActive || comingSoon}
              sx={{
                mt: 'auto',
                borderRadius: 2.5,
                textTransform: 'none',
                fontWeight: 700,
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
              {isActive ? 'Current Plan' : comingSoon ? 'Coming Soon' : actionLabel}
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

interface UserJourneyCardsProps {
  onStartTrial?: () => void;
  onStartFreeSocialListening?: () => void;
  onActivatePayg?: () => void;
  trialButtonText?: string;
  isTrialDisabled?: boolean;
  isFreeSocialListeningActive?: boolean;
  isFreeSocialListeningLoading?: boolean;
  isPaygActive?: boolean;
  isPaygLoading?: boolean;
}

export const UserJourneyCards = ({
  onStartTrial,
  onStartFreeSocialListening,
  onActivatePayg,
  trialButtonText = 'Start Free Trial',
  isTrialDisabled = false,
  isFreeSocialListeningActive = false,
  isFreeSocialListeningLoading = false,
  isPaygActive = false,
  isPaygLoading = false,
}: UserJourneyCardsProps) => {
  const router = useRouter();

  const freeSocialListeningActionLabel = isFreeSocialListeningActive ? 'On this plan' : isFreeSocialListeningLoading ? 'Checking plan...' : 'Start Free Social Listening';
  const freeSocialListeningOnAction = isFreeSocialListeningActive || isFreeSocialListeningLoading ? undefined : onStartFreeSocialListening;

  const paygActionLabel = isPaygActive ? 'On this plan' : isPaygLoading ? 'Activating...' : 'Activate PAYG';
  const paygOnAction = isPaygActive || isPaygLoading ? undefined : onActivatePayg;

  const userTypes: UserTypeCardProps[] = [
    {
      icon: <MdTimer size={22} />,
      iconBg: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)',
      title: 'Trial User',
      subtitle: '7 days free',
      description: 'New to Uri? Start with our free trial to explore all premium features before committing.',
      features: ['7-day full access trial', 'All social listening features', 'Limited lead generation', 'Upgrade prompts when limits hit'],
      badge: 'NEW USERS',
      actionLabel: trialButtonText,
      onAction: isTrialDisabled ? undefined : onStartTrial,
    },
    {
      icon: <FaHeadphones size={20} />,
      iconBg: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
      title: 'Free Social Listening',
      subtitle: 'Basic monitoring',
      description: 'Perfect for individuals who want to monitor social presence with optional lead gen access.',
      features: ['1 social account tracking', '1 report per month', 'Access to Dera AI assistant', 'PAYG or credits for leads'],
      actionLabel: freeSocialListeningActionLabel,
      onAction: freeSocialListeningOnAction,
      isActive: isFreeSocialListeningActive,
    },
    {
      icon: <FaHandshake size={20} />,
      iconBg: 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)',
      title: 'Social Listening (Paid)',
      subtitle: 'Pro monitoring',
      description: 'For growing brands that need more comprehensive social tracking and reporting.',
      features: ['3 social accounts tracking', '4 reports per month', 'Access to Dera AI assistant', 'Enhanced tracking capabilities'],
      actionLabel: 'Activate Plan',
      onAction: undefined,
      comingSoon: true,
    },
    {
      icon: <FaBuilding size={20} />,
      iconBg: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
      title: 'Enterprise',
      subtitle: 'Unlimited access',
      description: 'The ultimate solution for large organizations requiring unlimited capabilities.',
      features: ['Unlimited social accounts', 'Unlimited reports', 'Full AI capabilities', 'Priority support & collaboration'],
      actionLabel: 'Activate Plan',
      onAction: undefined,
      comingSoon: true,
    },
    {
      icon: <FaWallet size={20} />,
      iconBg: 'linear-gradient(135deg, #27ae60 0%, #219a52 100%)',
      title: 'PAYG Lead Gen',
      subtitle: 'Pay as you go',
      description: 'Flexible payment for lead generation. Fund your wallet and pay only for what you use.',
      features: ['Fund wallet (min ₦5,000)', 'Pay per scan & lead action', 'No commitment required', 'Instant deductions'],
      actionLabel: paygActionLabel,
      onAction: paygOnAction,
      isActive: isPaygActive,
    },
    {
      icon: <FaCoins size={20} />,
      iconBg: `linear-gradient(135deg, ${LightThemeColors.uriColor} 0%, #B8186A 100%)`,
      title: 'Credit Bundles',
      subtitle: 'Best value',
      description: 'Buy credit bundles upfront for the best per-action pricing. Ideal for power users.',
      features: ['Up to 10% savings vs PAYG', 'Bundles from 10-150 credits', 'Credits never expire', 'Discounted enrichment costs'],
      isHighlighted: true,
      actionLabel: 'Buy Credits',
      onAction: undefined,
      comingSoon: true,
    },
  ];

  return (
    <Box sx={{ py: 6 }}>
      {/* Section Header */}
      <Box textAlign="center" mb={5}>
        <Chip
          label="CHOOSE YOUR PATH"
          sx={{
            backgroundColor: alpha('#9b59b6', 0.1),
            color: '#9b59b6',
            fontWeight: 700,
            mb: 2,
          }}
        />
        <Typography variant="h4" fontWeight={800} sx={{ color: '#141414', mb: 1 }}>
          Find Your Perfect Fit
        </Typography>
        <Typography variant="body1" sx={{ color: '#6B6B6B', maxWidth: 600, mx: 'auto' }}>
          Whether you&apos;re exploring or scaling, we have a plan that fits your needs and budget.
        </Typography>
      </Box>

      {/* User Type Cards */}
      <Grid container spacing={3} sx={{ pt: 2 }}>
        {userTypes.map((userType, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <UserTypeCard {...userType} />
          </Grid>
        ))}
      </Grid>

      {/* How It Works Section */}
      <Box
        sx={{
          mt: 6,
          p: 4,
          borderRadius: 4,
          background: `linear-gradient(135deg, ${alpha(LightThemeColors.uriColor, 0.03)} 0%, ${alpha('#9b59b6', 0.05)} 100%)`,
          border: '1px solid',
          borderColor: alpha(LightThemeColors.uriColor, 0.1),
        }}
      >
        <Typography variant="h6" fontWeight={800} sx={{ color: '#141414', mb: 3, textAlign: 'center' }}>
          How Lead Generation Pricing Works
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Stack direction="row" alignItems="flex-start" gap={2}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: LightThemeColors.uriColor,
                  color: 'white',
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                1
              </Box>
              <Box>
                <Typography fontWeight={700} sx={{ color: '#141414', mb: 0.5 }}>
                  Choose Payment Method
                </Typography>
                <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                  Select wallet (PAYG) for flexibility or buy credit bundles for savings.
                </Typography>
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack direction="row" alignItems="flex-start" gap={2}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: LightThemeColors.uriColor,
                  color: 'white',
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                2
              </Box>
              <Box>
                <Typography fontWeight={700} sx={{ color: '#141414', mb: 0.5 }}>
                  Scan & Generate Leads
                </Typography>
                <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                  Search social platforms and save leads to your database.
                </Typography>
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack direction="row" alignItems="flex-start" gap={2}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: LightThemeColors.uriColor,
                  color: 'white',
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                3
              </Box>
              <Box>
                <Typography fontWeight={700} sx={{ color: '#141414', mb: 0.5 }}>
                  Enrich & Export
                </Typography>
                <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                  Reveal emails and phone numbers, then export to CSV or CRM.
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default UserJourneyCards;
