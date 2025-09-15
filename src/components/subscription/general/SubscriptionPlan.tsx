import { TextHelper } from '@/helpers/TextHelper';
import { Box, Button, Divider, Typography } from '@mui/material';
import { IconType } from 'react-icons';
import { BsFillPatchCheckFill } from 'react-icons/bs';
import { PiStackSimpleFill } from 'react-icons/pi';

interface SubscriptionPlanProps {
  planType: string;
  price: number | string;
  duration: string;
  planFeatures: {
    includedFeatures: string[];
    excludedFeatures?: string[];
  };
  onSelect: () => void;
  subTitle: string;
  icon?: IconType;
  selected?: boolean;
  buttonText?: string;
  recommended?: boolean;
  description?: string;
}

const SubscriptionPlan = ({ duration, planFeatures, planType, price, recommended, onSelect, selected, icon: Icon, buttonText, subTitle, description }: SubscriptionPlanProps) => {
  return (
    <Box
      sx={{
        backgroundColor: '#FDFDFD',
        maxWidth: '386px',
        minWidth: { xs: '300px', md: '320px' },
        boxShadow: '0px 2px 4px 0px #00000040',
        px: '20px',
        py: '50px',
        borderRadius: '20px',
        position: 'relative',
        overflow: 'hidden',
        border: selected ? '1px solid #CD1B78' : 'none',
        width: '100%',
      }}
    >
      {recommended && (
        <Box
          sx={{
            position: 'absolute',
            top: 50,
            right: -60,
            transform: 'rotate(40deg)',
            backgroundColor: '#CD1B78',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '252px',
          }}
        >
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 500,
              color: '#FFFFFF',
              textTransform: 'uppercase',
            }}
          >
            Recommended
          </Typography>
        </Box>
      )}

      {Icon ? <Icon size={18} color="#CD1B78" /> : <PiStackSimpleFill size={18} color="#CD1B78" />}
      <Typography
        sx={{
          fontSize: '20px',
          fontWeight: 600,
          color: '#131313',
          mt: '5px',
        }}
      >
        {TextHelper.capitalize(planType)}
      </Typography>
      <Typography
        sx={{
          fontSize: '14px',
          fontWeight: 600,
          color: '#A6A6A6',
        }}
      >
        {subTitle}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          mt: '28px',
        }}
      >
        <Typography
          sx={{
            fontSize: '48px',
            fontWeight: 800,
            color: '#141416',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {typeof price === 'string' ? price : TextHelper.formatShortAmountWithoutDiscount(price)}{' '}
          <Box
            component="span"
            sx={{
              fontSize: '14px',
              fontWeight: 500,
              color: '#8C8C8C',
            }}
          >
            {description ? duration : ''}
          </Box>
        </Typography>
        {description ? (
          <Typography
            sx={{
              fontSize: '12px',
              fontWeight: 600,
              color: '#CD1B78',
              maxWidth: '151px',
              mx: 'auto',
              textAlign: 'center',
              minHeight: '40px',
              mb: '11px',
            }}
          >
            {description}
          </Typography>
        ) : (
          <Typography
            sx={{
              fontSize: '12px',
              fontWeight: 500,
              color: '#8C8C8C',
              maxWidth: '151px',
              mx: 'auto',
              textAlign: 'center',
              minHeight: '40px',
              mb: '11px',
            }}
          >
            {duration}
          </Typography>
        )}
      </Box>
      <Button
        onClick={onSelect}
        variant={selected ? 'contained' : 'outlined'}
        fullWidth
        sx={{
          borderRadius: '12px',
          mb: '29px',
          py: '9px',
          boxShadow: 'none',
        }}
      >
        {buttonText ?? 'Select Plan'}
      </Button>
      <Divider />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '13px',
          mt: '17px',
        }}
      >
        {(planFeatures?.includedFeatures ?? []).map((feature) => (
          <Box
            key={feature}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <BsFillPatchCheckFill size={20} color="#CD1B78" />
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: 500,
                color: '#131313',
              }}
            >
              {feature}
            </Typography>
          </Box>
        ))}
        {planFeatures?.excludedFeatures?.map((feature) => (
          <Box
            key={feature}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <BsFillPatchCheckFill size={20} color="#B3B3B3" />
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: 500,
                color: '#B3B3B3',
                textDecoration: 'line-through',
              }}
            >
              {feature}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default SubscriptionPlan;
