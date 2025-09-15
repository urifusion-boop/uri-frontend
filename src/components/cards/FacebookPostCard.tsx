import { queryClient } from '@/configs/query-client.config';
import { TextHelper } from '@/helpers/TextHelper';
import { FacebookPostDto } from '@/models/dtos/FacebookInsightsDto';
import { CommentData } from '@/models/dtos/InstagramInsights';
import { Box, Button, Typography } from '@mui/material';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { IconType } from 'react-icons';
import { BsCameraVideoOffFill } from 'react-icons/bs';
import { CiImageOff } from 'react-icons/ci';
import { FaFacebook } from 'react-icons/fa6';
import FacebookPostModal from '../modals/FacebookModal';

interface FacebookPostCardProps {
  post: FacebookPostDto | null;
  isDashboard?: boolean;
  isStory?: boolean;
  noOfCaptionLines?: number;
  onShowSentiments?: (id: string, comments: CommentData[] | undefined, media_type: string) => void;
  height?: number | string;
  PlatformIcon?: IconType;
  onClick?: () => void;
}

const FacebookPostCard: React.FC<FacebookPostCardProps> = ({ post, isDashboard, isStory, noOfCaptionLines = 50, onShowSentiments, height, PlatformIcon, onClick }) => {
  const caption = TextHelper.truncateText(post?.attachments?.data?.[0]?.description, noOfCaptionLines, '....') || 'No caption provided.';

  const [showModal, setShowModal] = useState(false);

  const convertToCommentData = post?.comments?.data?.map((comment) => {
    return {
      id: comment?.id,
      text: comment?.message,
      timestamp: comment?.created_time,
      username: 'user',
    };
  });

  return (
    <>
      <Box
        sx={{
          height: height ? 'fit-content' : '100%',
          maxWidth: height ? 400 : '100%',
          mx: 'auto',
        }}
        alignSelf={'stretch'}
      >
        {/* Card Body */}
        <Box
          sx={{
            borderTop: '10px solid 	#1877F2',
            minHeight: height || 180,
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
              {PlatformIcon ? <PlatformIcon size={16} color={'#fff'} /> : <FaFacebook size={20} color={'#fff'} />}
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
              {post?.created_time && dayjs(post?.created_time).format('DD MMM YYYY HH:mm A')}
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

          {post?.attachments?.data?.map((item, index) => (
            <Box key={index} sx={{ maxWidth: 500, marginBottom: 2 }}>
              {item?.media_type === 'video' ? (
                <Box
                  component="video"
                  src={item?.media?.source ?? item?.url}
                  controls
                  loop
                  sx={{
                    height: height ? 150 : 200,
                    width: '100%',
                  }}
                />
              ) : item?.media?.image?.src ? (
                <Box
                  component="img"
                  src={item?.media?.image?.src}
                  alt={item.title || 'Media'}
                  sx={{
                    width: '100%',
                    height: height ? 150 : 200,
                    objectFit: 'cover',
                    borderRadius: 2,
                  }}
                />
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: height ? 150 : 200,
                    fontSize: 100,
                    color: 'rgba(0, 0, 0, 0.1)',
                    backgroundColor: '#f5f5f5',
                  }}
                >
                  <BsCameraVideoOffFill />
                </Box>
              )}
            </Box>
          ))}

          {post?.attachments?.data && post.attachments.data.length === 0 && (
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

          {/* Post Stats */}
          <Box sx={{ mt: 2 }} display={isDashboard ? 'flex' : 'block'} justifyContent={isDashboard ? 'space-between' : 'flex-start'} gap={1}>
            {!isStory && (
              <>
                {/* reaction */}
                {post?.reactions?.summary?.total_count && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 0.5,
                      gap: 0.5,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontSize: {
                          sm: '0.6rem',
                          md: '0.65rem',
                          lg: '0.75rem',
                        },
                        color: '#555',
                      }}
                    >
                      Reaction{isDashboard ? ':' : ''}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontSize: {
                          sm: '0.6rem',
                          md: '0.65rem',
                          lg: '0.75rem',
                        },
                        color: '#555',
                      }}
                    >
                      {post?.reactions?.summary?.total_count ?? 0}
                    </Typography>
                  </Box>
                )}

                {/* Comments */}
                {post?.comments?.data?.length && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 0.5,
                      gap: 0.5,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontSize: {
                          sm: '0.6rem',
                          md: '0.65rem',
                          lg: '0.75rem',
                        },
                        color: '#555',
                      }}
                    >
                      Comments{isDashboard ? ':' : ''}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontSize: {
                          sm: '0.6rem',
                          md: '0.65rem',
                          lg: '0.75rem',
                        },
                        color: '#555',
                      }}
                    >
                      {post?.comments?.data?.length ?? 0}
                    </Typography>
                  </Box>
                )}
              </>
            )}
          </Box>

          {onShowSentiments && (
            <Box display={'flex'} justifyContent={'center'}>
              <Button
                style={{
                  fontSize: 11,
                }}
                color="primary"
                onClick={() => {
                  queryClient.invalidateQueries(['media-post-insights']);
                  if (onShowSentiments) onShowSentiments(post?.id ?? '', convertToCommentData, post?.attachments?.data?.[0]?.media_type ?? '');
                }}
              >
                Show Engagement
              </Button>
            </Box>
          )}

          {onClick && (
            <Box display={'flex'} justifyContent={'center'}>
              <Button
                style={{
                  fontSize: 11,
                }}
                color="primary"
                onClick={() => onClick()}
              >
                Show Engagement
              </Button>
            </Box>
          )}
        </Box>
      </Box>
      <FacebookPostModal
        post={{
          description: post?.attachments?.data?.[0]?.description ?? '',
          media_type: post?.attachments?.data?.[0]?.media_type ?? '',
          source: post?.attachments?.data?.[0]?.media?.image?.src ?? post?.attachments?.data?.[0]?.media?.source ?? post?.attachments?.data?.[0]?.url ?? '',
        }}
        open={showModal}
        handleClose={() => setShowModal(false)}
      />
    </>
  );
};

export default FacebookPostCard;
