import { TextHelper } from '@/helpers/TextHelper';
import { HighPriorityAlert } from '@/models/dtos/MentionInsightsDto';
import { Avatar, Box, Typography } from '@mui/material';
import dayjs from 'dayjs';

interface PriorityAlertCardProps {
  alert: HighPriorityAlert;
}

const PriorityAlertCard = ({ alert }: PriorityAlertCardProps) => {
  const priorityColor = {
    high: '#B3170C',
    medium: '#EBBA0B',
    low: '#0BEB1A',
  };
  return (
    <Box
      sx={{
        border: '1px solid #8C8C8C4D',
        borderRadius: '10px',
        padding: '10px',
      }}
    >
      {/* Details */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <Avatar
          src={alert.image}
          alt={alert.author}
          sx={{
            width: '40px',
            height: '40px',
          }}
        />
        <Box>
          <Typography fontWeight={600} fontSize={14} color="#6D6D6D" mb={'4px'}>
            {TextHelper.getDomainName(alert.author)}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography fontWeight={600} fontSize={12} color="#6D6D6D">
              {dayjs(alert.created_at).format('DD MMMM YYYY')}
            </Typography>
            {/* <GoDotFill size={10} color="#D9D9D9" /> */}
            {/* <Typography fontWeight={600} fontSize={12} color="#6D6D6D">
              {alert.followers} Followers
            </Typography> */}
            {/* <GoDotFill size={10} color="#D9D9D9" /> */}
            {/* <Typography fontWeight={600} fontSize={12} color="#6D6D6D">
              {alert.reach} Reach
            </Typography> */}
          </Box>
        </Box>
      </Box>
      {/* Content */}
      <Typography
        sx={{
          color: '#202020',
          fontSize: '14px',
          py: 1,
        }}
      >
        {alert.comment}
      </Typography>

      <Box
        sx={{
          backgroundColor: priorityColor[alert.sentiment_priority.toLowerCase() as keyof typeof priorityColor] ?? '#555',
          width: 'fit-content',
          ml: 'auto',
          py: '5px',
          px: '10px',
          borderRadius: '6px',
        }}
      >
        <Typography
          sx={{
            color: '#fff',
            fontSize: '14px',
            fontWeight: 600,
          }}
        >
          {alert.sentiment_priority}
        </Typography>
      </Box>
    </Box>
  );
};

export default PriorityAlertCard;
