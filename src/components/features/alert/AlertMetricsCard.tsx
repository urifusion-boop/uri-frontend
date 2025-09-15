import { Box, Skeleton, Typography } from '@mui/material';
import { FaArrowDownLong, FaArrowUpLong } from 'react-icons/fa6';

interface AlertMetricsCardProps {
  alert: {
    title: string;
    amount: number;
    percentage: number;
    image: string;
    percentageColor: string;
    arrowDirection: string;
  };
  loading?: boolean;
}

const AlertMetricsCard = ({ alert, loading }: AlertMetricsCardProps) => {
  return (
    <Box
      sx={{
        boxShadow: '-1px -1px 5px 2px #0000000D',
        backgroundColor: '#FFFFFF',
        width: '100%',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        borderRadius: '10px',
      }}
    >
      <Box
        sx={{
          pl: '30px',
          pb: '15px',
          pt: '20px',
        }}
      >
        <Typography
          sx={{
            color: '#3A3A3A',
            fontSize: '20px',
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}
        >
          {alert.title}
        </Typography>
        <Typography
          sx={{
            color: '#282828',
            fontSize: '32px',
            fontWeight: 700,
            mt: '15px',
            mb: '10px',
          }}
        >
          {loading ? <Skeleton variant="text" width={80} /> : alert.amount}
        </Typography>
        <Typography
          sx={{
            color: '#818181',
            fontSize: '13px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          {alert.arrowDirection === 'up' ? <FaArrowUpLong color={alert.percentageColor} size={12} /> : <FaArrowDownLong color={alert.percentageColor} size={12} />}
          <span style={{ color: alert.percentageColor }}>{alert.percentage}%</span> from last week
        </Typography>
      </Box>
      <img
        src={alert.image}
        alt=""
        style={{
          width: '100%',
          height: '100%',
          maxWidth: '155px',
          maxHeight: '93px',
        }}
      />
    </Box>
  );
};

export default AlertMetricsCard;
