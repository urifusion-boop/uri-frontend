import { queryClient } from '@/configs/query-client.config';
import { TextHelper } from '@/helpers/TextHelper';
import { ReelsDto } from '@/models/dtos/FacebookInsightsDto';
import { Box, Button, Typography } from '@mui/material';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { CiImageOff } from 'react-icons/ci';
import { FaFacebook } from 'react-icons/fa6';
import FacebookPostModal from '../modals/FacebookModal';

interface FacebookPostCardProps {
  reels: ReelsDto;
  isDashboard?: boolean;
  isStory?: boolean;
  noOfCaptionLines?: number;
  onShowSentiments?: (id: string) => void;
}

const FacebookReelsCard: React.FC<FacebookPostCardProps> = ({ reels, isDashboard, isStory, noOfCaptionLines = 50, onShowSentiments }) => {
  const caption = TextHelper.truncateText(reels.description, noOfCaptionLines, '....') || 'No caption provided.';

  const [showModal, setShowModal] = useState(false);

  console.log(reels);

  return (
    <>
      <Box
        sx={{
          height: '100%',
        }}
      >
        {/* Card Body */}
        <Box
          height={'100%'}
          sx={{
            borderTop: '10px solid 	#1877F2',
            minHeight: 180,
            bgcolor: '#fff',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            borderRadius: '10px',
            padding: 2,
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.02)',
            },
            height: '100%',
          }}
        >
          {/* Social Icon and Date */}
          <Box
            sx={{
              flexDirection: 'row',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2,
            }}
          >
            {/* Instagram Icon */}
            <Box
              bgcolor={'#1877F2'}
              sx={{
                height: 25,
                width: 25,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '50%',
              }}
            >
              <FaFacebook size={15} color="#fff" />
            </Box>

            {/* Post Date */}
            <Typography
              variant="subtitle2"
              sx={{
                fontSize: {
                  sm: isDashboard ? '0.4rem' : '0.5rem',
                  md: isDashboard ? '0.4rem' : '0.6rem',
                  lg: isDashboard ? '0.4rem' : '0.7rem',
                },
                color: '#888',
              }}
            >
              {dayjs(reels.created_time).format('DD MMM YYYY HH:mm A')}
            </Typography>
          </Box>

          {/* Post Caption */}

          <Typography
            variant="body2"
            sx={{
              fontSize: {
                sm: '0.5rem',
                md: '0.6rem',
                lg: isDashboard ? '0.60rem' : '0.80rem',
              },
              mb: isDashboard ? 0.1 : 2,
              color: '#333',
              minHeight: 50,
            }}
          >
            {isStory ? '' : caption}{' '}
            <Button
              style={{ fontSize: 11 }}
              color="primary"
              onClick={() => {
                setShowModal(true);
              }}
            >
              {isStory ? 'View Story' : 'read more...'}
            </Button>
          </Typography>

          {reels.source && (
            <Box sx={{ maxWidth: 500, marginBottom: 2 }}>
              <Box
                component="video"
                src={reels.source}
                controls
                loop
                sx={{
                  height: 200,
                  width: '100%',
                }}
              />
            </Box>
          )}

          {!reels.source && (
            <Box
              sx={{
                height: isDashboard ? 180 : 200,
                width: '100%',
                mt: 1,
                borderRadius: 2,
                overflow: 'hidden',
                mb: 2,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: '#f5f5f5',
              }}
            >
              <CiImageOff color="#999" size={30} />
            </Box>
          )}

          {onShowSentiments && (
            <Box display={'flex'} justifyContent={'center'}>
              <Button
                style={{
                  fontSize: 11,
                }}
                color="primary"
                onClick={() => {
                  queryClient.invalidateQueries(['media-post-insights']);
                  if (onShowSentiments) onShowSentiments(reels.id);
                }}
              >
                Show Engagement
              </Button>
            </Box>
          )}
        </Box>
      </Box>
      <FacebookPostModal
        post={{
          description: reels.description,
          media_type: 'video',
          source: reels.source,
        }}
        open={showModal}
        handleClose={() => setShowModal(false)}
      />
    </>
  );
};

export default FacebookReelsCard;
