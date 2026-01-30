import { LightThemeColors } from '@/configs/colors.config';
import { alpha, Box, Button, Card, CardContent, Chip, List, ListItem, ListItemIcon, ListItemText, Stack, Typography } from '@mui/material';
import { FaCheck } from 'react-icons/fa';

interface SubscriptionPlanCardProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
  description?: string;
  features: string[];
  price: string;
  interval: string;
  isHighlighted?: boolean;
  badge?: string;
  actionLabel?: string;
  onAction?: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
}

const SubscriptionPlanCard = ({
  icon,
  iconBg,
  title,
  subtitle,
  description,
  features,
  price,
  interval,
  isHighlighted,
  badge,
  actionLabel,
  onAction,
  isLoading,
  isDisabled,
}: SubscriptionPlanCardProps) => {
  return (
    <Card
      sx={{
        borderRadius: 4,
        height: '100%',
        border: isHighlighted ? `2px solid ${LightThemeColors.uriColor}` : '1px solid #e0e0e0',
        position: 'relative',
        overflow: 'visible',
        transition: 'all 200ms ease',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: isHighlighted ? `0 12px 40px ${alpha(LightThemeColors.uriColor, 0.2)}` : '0 12px 40px rgba(0,0,0,0.1)',
        },
      }}
    >
      {badge && (
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
                flexShrink: 0,
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

          {/* Price */}
          <Box>
            <Typography variant="h4" fontWeight={800} sx={{ color: '#141414', display: 'inline' }}>
              {price}
            </Typography>
            {price !== 'Custom' && (
              <Typography variant="body2" component="span" sx={{ color: '#6B6B6B', ml: 0.5 }}>
                /{interval}
              </Typography>
            )}
          </Box>

          {/* Description */}
          {description && (
            <Typography variant="body2" sx={{ color: '#6B6B6B', lineHeight: 1.6 }}>
              {description}
            </Typography>
          )}

          <Divider sx={{ my: 2 }} />

          {/* Features */}
          <List dense sx={{ flex: 1, p: 0 }}>
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
              variant={isHighlighted ? 'contained' : 'outlined'}
              fullWidth
              onClick={onAction}
              disabled={!onAction || isLoading || isDisabled}
              sx={{
                mt: 'auto',
                borderRadius: 2.5,
                textTransform: 'none',
                fontWeight: 700,
                py: 1.5,
                borderColor: LightThemeColors.uriColor,
                color: isHighlighted ? 'white' : LightThemeColors.uriColor,
                backgroundColor: isHighlighted ? LightThemeColors.uriColor : 'transparent',
                '&:hover': {
                  borderColor: LightThemeColors.uriColor,
                  backgroundColor: isHighlighted ? alpha(LightThemeColors.uriColor, 0.9) : alpha(LightThemeColors.uriColor, 0.05),
                  color: isHighlighted ? 'white' : LightThemeColors.uriColor,
                  boxShadow: isHighlighted ? `0 4px 12px ${alpha(LightThemeColors.uriColor, 0.3)}` : 'none',
                },
                '&.Mui-disabled': {
                  borderColor: '#e0e0e0',
                  color: '#9e9e9e',
                  backgroundColor: '#f5f5f5',
                },
              }}
            >
              {actionLabel}
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

import { Divider } from '@mui/material';

export default SubscriptionPlanCard;
