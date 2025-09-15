import { LightThemeColors } from '@/configs/colors.config';
import { MentionDto } from '@/models/dtos/MentionInsightsDto';
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded';
import { Avatar, Box, List, ListItem, ListItemText, Skeleton, Typography, lighten } from '@mui/material';
import dayjs from 'dayjs';

interface AlertProps {
  alerts?: (MentionDto | undefined)[];
  onClick?: (mention: MentionDto) => void;
  isFetchingMore?: boolean;
  chat?: boolean;
  selectedMention?: MentionDto;
}

const AlertList = ({ alerts, onClick, isFetchingMore, chat, selectedMention }: AlertProps) => {
  const getDate = (date: string) => (dayjs(date).format('DD MMM YYYY') === 'Invalid Date' ? date : dayjs(date).format('DD MMM YYYY'));

  return (
    <List
      style={{
        paddingTop: '0px',
        backgroundColor: '#fff',
        height: '100%',
        cursor: 'pointer',
      }}
    >
      {(alerts ?? []).map((alert) => (
        <ListItem
          key={alert?.id}
          sx={{
            borderBottom: '1px solid #eaeaea',
            backgroundColor: !alert?.is_read ? lighten(LightThemeColors.uriColor, 0.95) : '#fff',
            '&:hover': {
              backgroundColor: !alert?.is_read ? lighten(LightThemeColors.uriColor, 0.9) : '#f9f9f9',
            },
          }}
          className="py-[10px] md:py-[16px]"
          onClick={() => {
            alert && onClick?.(alert);
          }}
        >
          {chat ? (
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      backgroundColor: '#000',
                    }}
                  />
                  <Box>
                    <Typography
                      sx={{
                        color: '#212529',
                        fontSize: '18px',
                        fontWeight: 600,
                      }}
                    >
                      Willy Williamson
                    </Typography>
                    <Typography
                      sx={{
                        color: '#4E4E4E',
                        fontSize: '14px',
                        fontWeight: 500,
                      }}
                    >
                      Williams Williamson
                    </Typography>
                  </Box>
                </Box>
                <Typography className="text-[14px] font-bold" sx={{ color: '#CD1B78' }}>
                  {getDate(alert?.timestamp ?? '')}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#9e9e9e', marginTop: '4px' }}>
                {alert?.comment}
              </Typography>
            </Box>
          ) : (
            <ListItemText
              primary={
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Box
                      sx={{
                        backgroundColor: alert?.is_read ? '#e8e8e8' : LightThemeColors.uriColor,
                        height: '10px',
                        width: '10px',
                        borderRadius: '50%',
                      }}
                    />
                    <Typography className="text-[20px] font-bold">{alert?.keyword}</Typography>
                  </div>
                  <Typography className="text-[14px] font-bold" sx={{ color: '#CD1B78' }}>
                    {getDate(alert?.timestamp ?? '')}
                  </Typography>
                </div>
              }
              secondary={
                <>
                  <div className="flex items-center">
                    {alert?.starred && <StarRateRoundedIcon className="text-[#CD1B78] text-[14px]" />}
                    <Typography variant="body2" sx={{ color: '#4a4a4a', marginRight: '8px' }}>
                      {alert?.author}
                    </Typography>
                  </div>
                  <Typography variant="body2" sx={{ color: '#9e9e9e', marginTop: '4px' }}>
                    {alert?.comment}
                  </Typography>
                </>
              }
            />
          )}
        </ListItem>
      ))}

      {isFetchingMore && <Skeleton variant="rectangular" height={100} animation="wave" />}
    </List>
  );
};

export default AlertList;
