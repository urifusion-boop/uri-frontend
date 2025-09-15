import { Box, Chip, Typography } from '@mui/material';

interface LeadNotificationItemProps {
  type: string;
  message: string;
  priority: 'High' | 'Medium' | 'Low';
  time: string;
  color: string;
}

const LeadNotificationItem = ({ type, message, priority, time, color }: LeadNotificationItemProps) => {
  return (
    <Box
      sx={{
        border: `1px solid ${color}`,
        borderRadius: '12px',
        px: 2,
        py: 1.5,
        mb: 2,
        cursor: 'pointer',
      }}
    >
      <Typography fontWeight={600} color={color} fontSize="14px" mb={0.5}>
        {type}
      </Typography>
      <Typography fontSize="13px" color="#374151">
        {message}
      </Typography>
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
        <Chip label={priority} size="small" color="success" sx={{ fontSize: '10px' }} />
        <Typography fontSize="12px" color="#6b7280">
          {time}
        </Typography>
      </Box>
    </Box>
  );
};

export default LeadNotificationItem;
