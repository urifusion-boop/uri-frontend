import { Avatar, Box, IconButton, Typography } from '@mui/material';
import { FaRegStar, FaStar } from 'react-icons/fa6';

import { LightThemeColors } from '@/configs/colors.config';
import { MentionDto } from '@/models/dtos/MentionInsightsDto';
import { DeleteOutline } from '@mui/icons-material'; // Add Material UI icons for Star and Delete
import dayjs from 'dayjs';
import { HiBellSlash } from 'react-icons/hi2';
import EmptyState from '../../atoms/EmptyState';

interface AlertDetailProps {
  data?: MentionDto | null;
  handleStarClick: (data?: MentionDto) => void;
  handleDeleteClick: (data?: MentionDto) => void;
}

const AlertDetail = ({ data, handleDeleteClick, handleStarClick }: AlertDetailProps) => {
  const getDate = (date: string) => (dayjs(date).format('DD MMM, h:mm A') === 'Invalid Date' ? date : dayjs(date).format('DD MMM, h:mm A'));

  return data ? (
    <Box
      sx={{
        flex: 1,
        paddingBottom: '80px',
        height: '100%',
      }}
      className="px-[16px] md:px-[24px]"
    >
      <div className="flex justify-between items-center py-3 md:py-[20px] border-b-[1px] border-b-[#8C8C8C4D]">
        <div className="flex items-center space-x-2">
          <Avatar src={data?.image} />
          <div className="space-y-0">
            <Typography className="text-[20px] font-bold">{data?.keyword}</Typography>
            <Typography className="text-[16px] font-semi-bold text-[#4E4E4E] -mt-2">{data?.author}</Typography>
          </div>
        </div>
        {!data?.deleted && (
          <div>
            <IconButton onClick={() => handleStarClick(data)}>{data?.starred ? <FaStar color={LightThemeColors.uriColor} /> : <FaRegStar color="#A6A6A6" />}</IconButton>

            <IconButton onClick={() => handleDeleteClick(data)}>
              <DeleteOutline color="error" />
            </IconButton>
          </div>
        )}
      </div>

      <div className="mt-5 md:mt-[32px] flex items-end space-x-2">
        <Avatar src={data?.image} />
        <div>
          <div className="px-3 md:px-15 py-3 md:py-[50px] bg-[#FFE9F599] rounded-[10px] md:w-[390px]">
            <Typography className="text-[14px] font-light text-#5E5E5E ">{data?.comment}</Typography>
          </div>

          <Typography className="font-semibold text-[#8C8C8C] mt-3">{getDate(data?.timestamp ?? '')}</Typography>
        </div>
      </div>
    </Box>
  ) : (
    <Box>
      <EmptyState heading="No Alert Selected" message="Please select an alert to view details" actionRequired={false} icon={<HiBellSlash size={50} />} />
    </Box>
  );
};

export default AlertDetail;
