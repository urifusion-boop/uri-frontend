import { LightThemeColors } from '@/configs/colors.config';
import { ColorHelper } from '@/helpers/ColorHelper';
import { MediaHelper } from '@/helpers/MediaHelper';
import { PlatformHelper } from '@/helpers/PlatformHelper';
import { TextHelper } from '@/helpers/TextHelper';
import { InfluencerDto } from '@/models/dtos/InfluencerDto';
import { SocialMediaPostDto } from '@/models/dtos/SocialMediaPostDto';
import { MediaTypeEnum } from '@/models/enum-models/MediaTypeEnum';
import { PostStatusEnum } from '@/models/enum-models/PostStatusEnum';
import { Box, Tooltip, Typography } from '@mui/material';
import dayjs from 'dayjs';
import React from 'react';
import { MdCheckCircle, MdEdit, MdError, MdHelpOutline, MdHourglassEmpty, MdSchedule } from 'react-icons/md';
import PlatformIcon from './PlatformIcons';

interface PostCardProps {
  post: SocialMediaPostDto;
  handlePostSelect?: (post: SocialMediaPostDto) => void;
  influencerData: InfluencerDto[];
}

interface StatusIconProps {
  status: keyof typeof PostStatusEnum;
}

const PostCard: React.FC<PostCardProps> = ({ post, handlePostSelect, influencerData }) => {
  const renderMediaPreview = () => {
    const firstMedia = post?.media?.[0];

    return MediaHelper.getMediaType(firstMedia?.media_type ?? '') === MediaTypeEnum.IMAGE ? (
      <Tooltip title="Click to view media">
        <img
          src={TextHelper.setUrl(firstMedia?.url)}
          alt="Post media"
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '8px',
            objectFit: 'cover',
          }}
        />
      </Tooltip>
    ) : (
      <Tooltip title="Click to view media">
        <video
          muted
          src={TextHelper.setUrl(firstMedia?.url)}
          style={{
            width: '20px',
            borderRadius: '8px',
            height: '20px',
          }}
        />
      </Tooltip>
    );
  };

  const accountDetail = PlatformHelper.getSocialUserDetailsByPlatform(influencerData, post.platform?.toUpperCase() ?? '', post.social_user_id);

  const statusIconMap = {
    QUEUED: MdHourglassEmpty,
    PUBLISHED: MdCheckCircle,
    FAILED: MdError,
    SCHEDULED: MdSchedule,
    DRAFT: MdEdit,
  };

  const StatusIcon = ({ status }: StatusIconProps) => {
    const Icon = statusIconMap[status as keyof typeof statusIconMap] || MdHelpOutline;
    return <Icon size={12} color="#fff" />;
  };

  return (
    <>
      <Box
        alignSelf={'stretch'}
        onClick={() => handlePostSelect && handlePostSelect(post)}
        sx={{
          cursor: 'pointer',
          height: '100%',
          position: 'relative',
        }}
      >
        <Box
          height={'100%'}
          sx={{
            borderTop: `10px solid ${ColorHelper.getSocialMediaColor(post.platform ?? '')}`,
            minHeight: 180,
            bgcolor: '#fff',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            borderRadius: '10px',
            padding: 2,
            transition: 'transform 0.3s ease',
          }}
        >
          {/* Social Icon and Date */}
          <Box
            sx={{
              flexDirection: 'row',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {/* Instagram Icon */}
            <Box
              sx={{
                height: 25,
                width: 25,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '50%',
                border: `1px solid ${ColorHelper.getSocialMediaColor(post.platform ?? '')}`,
              }}
            >
              {<PlatformIcon platform={post.platform ?? ''} />}
            </Box>

            {/* Post Date */}
            <Typography
              variant="subtitle2"
              sx={{
                fontSize: {
                  sm: '0.5rem',
                  md: '0.6rem',
                  lg: '0.75rem',
                },
                color: '#888',
              }}
            >
              {dayjs(post?.start_date).format('MMM DD, YYYY')} {dayjs(post?.start_time).format('hh:mm A') === 'Invalid Date' ? post.start_time : dayjs(post?.start_time).format('hh:mm A')}
            </Typography>
          </Box>
          <Box sx={{ mb: 2, mt: 0.5 }}>
            <Typography fontSize={'0.6rem'}>@{accountDetail?.username ?? 'username'}</Typography>
          </Box>

          {/* Post Caption */}
          <Typography
            variant="body2"
            sx={{
              fontSize: {
                sm: '0.5rem',
                md: '0.6rem',
                lg: '0.75rem',
              },
              mb: 2,
              color: '#333',
              maxHeight: 40,
              minHeight: 40,
            }}
          >
            {post?.content ? TextHelper.truncateText(post.content ?? '', 100, '...') : 'No caption'}
          </Typography>

          {/* Media Preview */}
          <Box
            sx={{
              mb: 2,
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            {renderMediaPreview()}
            {post.media && post.media.length > 1 && (
              <Typography
                variant="caption"
                sx={{
                  fontSize: {
                    sm: '0.5rem',
                    md: '0.6rem',
                    lg: '0.75rem',
                  },
                  color: '#888',
                }}
              >
                +{post.media.length - 1}
              </Typography>
            )}
          </Box>

          {/* Post Stats */}
          <Box sx={{ mt: 2 }} gap={1} display="flex" justifyContent="space-between">
            <Typography
              variant="subtitle1"
              sx={{
                fontSize: {
                  sm: '0.5rem',
                  md: '0.6rem',
                  lg: '0.75rem',
                },
                mb: 2,
                color: '#333',
                maxHeight: 100,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <span>Status</span>
              <span
                style={{
                  backgroundColor: LightThemeColors.uriColor,
                  color: '#fff',
                  padding: '2px 6px',
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.5rem',
                }}
              >
                {TextHelper.capitalize(post?.status)}

                <StatusIcon status={post.status as keyof typeof PostStatusEnum} />
              </span>
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default PostCard;
