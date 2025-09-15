import styles from '@/styles/Organisms.module.css';
import { Box } from '@mui/material';
import React from 'react';
import useCustomTheme from '../../hooks/theme.hook';
import CustomButton from '../atoms/CustomButton';
import Text from '../atoms/CustomText';

interface IProps {
  eventData: {
    name: string;
    date: string;
    time: string;
    cover: string;
    description: string;
    location: string;
    saved: boolean;
  };
  onClick: () => void;
}

const EventCard: React.FC<IProps> = ({ eventData, onClick }) => {
  const { themeColors } = useCustomTheme();

  return (
    <div
      className={styles.eventCard}
      style={{
        backgroundColor: `${themeColors.background}`,
        border: `1px solid ${themeColors.borderColor}`,
      }}
    >
      <div
        className={styles.eventCardCover}
        style={{
          backgroundImage: `url(${eventData.cover})`,
        }}
        onClick={() => onClick()}
      ></div>
      <Box>
        <Text size={16} weight={700} sx={{ pt: 1 }}>
          {eventData.name}
        </Text>
        <Text size={13} weight={500} sx={{ pt: 1, pb: 1 }}>
          Model
        </Text>
      </Box>
      <Box className="d-flex">
        <img src="/assets/icons/location-icon.svg" alt="image" width={20} height={20} />
        <Text size={14} weight={500} sx={{ px: 1 }} color={'#6C727F'}>
          {eventData.location}
        </Text>
      </Box>
      <CustomButton mode="primary" style={{ width: '150px', margin: '16px 0px', fontSize: '16px' }} type="submit" data-testid="view-event-button" onClick={() => onClick()}>
        View full details
      </CustomButton>
    </div>
  );
};

export default EventCard;
