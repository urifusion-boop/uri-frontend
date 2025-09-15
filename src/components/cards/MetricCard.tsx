import { Box, Skeleton, Tooltip, Typography } from '@mui/material';

interface MetricCardProps {
  metric: {
    title: string;
    value: number;
    change: string;
    changeColor: string;
    description: string;
    icon: JSX.Element;
    changeIcon: JSX.Element;
    showTooltip?: boolean;
    tooltipText?: string;
  };
  isMobile?: boolean;
  isLoading?: boolean;
}

const MetricCard = ({ metric, isMobile, isLoading }: MetricCardProps) => {
  return (
    <Tooltip title={metric.showTooltip ? metric.tooltipText : ''} arrow placement="top">
      <Box
        p={3}
        border="1px solid #ddd"
        borderRadius={2}
        bgcolor="white"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          borderRadius: '12px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Box>
          <Typography variant="subtitle2" sx={{ color: '#6B7280', fontWeight: 600 }}>
            {metric.title}
          </Typography>
          <Typography
            variant="h4"
            fontSize={isMobile ? 18 : 25}
            sx={{
              fontWeight: 700,
              color: '#111827',
              marginTop: '8px',
              marginBottom: '8px',
            }}
          >
            {isLoading ? <Skeleton variant="text" width={80} height={30} /> : (metric.value ?? 0)}
          </Typography>
          <Box display="flex" alignItems="center">
            {metric.changeIcon}
            <Typography
              variant="subtitle2"
              sx={{
                color: metric.changeColor,
                fontWeight: 600,
                marginRight: '4px',
              }}
            >
              {metric.change}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#9CA3AF',
                fontWeight: 500,
              }}
            >
              {metric.description}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            backgroundColor: '#F3F4F6',
            borderRadius: '50%',
            width: 48,
            height: 48,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {metric.icon}
        </Box>
      </Box>
    </Tooltip>
  );
};

export default MetricCard;
