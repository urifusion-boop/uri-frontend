import { LightThemeColors } from '@/configs/colors.config';
import { NumberHelper } from '@/helpers/NumberHelper';
import { CreditBundleDto, CreditBundleTierEnum } from '@/models/dtos/CreditBundleDto';
import { Box, Button, Card, CardContent, Stack, Typography, alpha, styled } from '@mui/material';
import { FaBolt, FaCrown, FaRocket, FaStar } from 'react-icons/fa';

interface CreditBundleCardProps {
  bundle: CreditBundleDto;
  onPurchase: (tier: CreditBundleTierEnum) => void;
  isPurchasing?: boolean;
  isPopular?: boolean;
}

const tierIcons: Record<CreditBundleTierEnum, React.ReactNode> = {
  [CreditBundleTierEnum.SMALL]: <FaBolt size={18} />,
  [CreditBundleTierEnum.MEDIUM]: <FaStar size={18} />,
  [CreditBundleTierEnum.LARGE]: <FaCrown size={18} />,
  [CreditBundleTierEnum.ENTERPRISE]: <FaRocket size={18} />,
  [CreditBundleTierEnum.CUSTOM]: <FaBolt size={18} />,
};

const tierColors: Record<CreditBundleTierEnum, string> = {
  [CreditBundleTierEnum.SMALL]: '#3498db',
  [CreditBundleTierEnum.MEDIUM]: '#9b59b6',
  [CreditBundleTierEnum.LARGE]: '#f39c12',
  [CreditBundleTierEnum.ENTERPRISE]: '#e74c3c',
  [CreditBundleTierEnum.CUSTOM]: '#27ae60',
};

const StyledCard = styled(Card)<{ isPopular?: boolean }>(({ theme, isPopular }) => ({
  borderRadius: 16,
  overflow: 'hidden',
  transition: 'all 200ms ease',
  border: isPopular ? `2px solid ${LightThemeColors.uriColor}` : '1px solid #e0e0e0',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
  },
}));

export const CreditBundleCard = ({ bundle, onPurchase, isPurchasing, isPopular }: CreditBundleCardProps) => {
  const tierColor = tierColors[bundle.tier];
  const pricePerCredit = bundle.price / bundle.credits;

  return (
    <StyledCard isPopular={isPopular}>
      {isPopular && (
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            right: -30,
            backgroundColor: LightThemeColors.uriColor,
            color: 'white',
            px: 4,
            py: 0.5,
            transform: 'rotate(45deg)',
            fontSize: 10,
            fontWeight: 800,
          }}
        >
          POPULAR
        </Box>
      )}
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: alpha(tierColor, 0.12),
                color: tierColor,
              }}
            >
              {tierIcons[bundle.tier]}
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={800} sx={{ color: '#141414' }}>
                {bundle.name}
              </Typography>
              <Typography variant="caption" sx={{ color: '#6B6B6B' }}>
                {bundle.tier.charAt(0) + bundle.tier.slice(1).toLowerCase()} bundle
              </Typography>
            </Box>
          </Stack>

          <Box textAlign="center" py={2}>
            <Typography variant="h3" fontWeight={900} sx={{ color: tierColor }}>
              {bundle.credits}
            </Typography>
            <Typography variant="body2" sx={{ color: '#6B6B6B', fontWeight: 600 }}>
              credits
            </Typography>
          </Box>

          <Box
            sx={{
              p: 2,
              borderRadius: 3,
              backgroundColor: alpha(tierColor, 0.06),
              border: `1px solid ${alpha(tierColor, 0.15)}`,
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" sx={{ color: '#6B6B6B', fontWeight: 600 }}>
                Price
              </Typography>
              <Typography variant="h5" fontWeight={900} sx={{ color: '#141414' }}>
                {bundle.currency} {NumberHelper.formatNumber(bundle.price)}
              </Typography>
            </Stack>
            <Typography variant="caption" sx={{ color: '#8A8A8A', display: 'block', mt: 0.5 }}>
              ~₦{NumberHelper.formatNumber(Math.round(pricePerCredit))} per credit
            </Typography>
          </Box>

          <Button
            variant="contained"
            fullWidth
            onClick={() => onPurchase(bundle.tier)}
            disabled={isPurchasing}
            sx={{
              borderRadius: 3,
              py: 1.5,
              fontWeight: 800,
              backgroundColor: isPopular ? LightThemeColors.uriColor : tierColor,
              '&:hover': {
                backgroundColor: isPopular ? '#B8186A' : alpha(tierColor, 0.85),
              },
            }}
          >
            {isPurchasing ? 'Processing...' : 'Buy Now'}
          </Button>
        </Stack>
      </CardContent>
    </StyledCard>
  );
};
