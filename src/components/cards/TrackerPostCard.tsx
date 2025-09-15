import { Box, Button, Typography } from '@mui/material';
import React, { useState } from 'react';

import { DateHelper } from '@/helpers/DateHelper';
import { TextHelper } from '@/helpers/TextHelper';
import { BusinessProfileInsight } from '@/models/dtos/InstagramInsights';
import { MediaTypeEnum } from '@/models/enum-models/MediaTypeEnum';
import { useQueryClient } from '@tanstack/react-query';
import { useQueryState } from 'nuqs';
import { CiImageOff } from 'react-icons/ci';
import { FaVideoSlash } from 'react-icons/fa';
import { FaInstagram } from 'react-icons/fa6';
import MetricsCarousel from '../atoms/MetricsCarousel';
import PostModal from '../modals/PostModal';

interface TrackerPostCardProps {
  post: BusinessProfileInsight;
  noOfCaptionLines?: number;
  height?: number | string;
  isDashboard?: boolean;
  onShowSentiments?: () => void;
  isStory?: boolean;
  keywords?: string[];
  authenticated?: boolean;
  noShadow?: boolean;
}

const TrackerPostCard: React.FC<TrackerPostCardProps> = ({ post, noOfCaptionLines = 50, height = '100%', isDashboard = false, onShowSentiments, isStory, keywords, authenticated, noShadow }) => {
  const caption = TextHelper.truncateText(post.caption, noOfCaptionLines, '....') || 'No caption provided.';
  const [, setSelectedPost] = useQueryState('post');
  const [, setAction] = useQueryState('action');
  const [showModal, setShowModal] = useState(false);
  const [, setMediaType] = useQueryState('mediaType');

  const queryClient = useQueryClient();

  return (
    <>
      <Box alignSelf={'stretch'} height={height}>
        {/* Card Body */}
        <Box
          height={'100%'}
          sx={{
            borderTop: '10px solid #c13584',
            minHeight: height || 180,
            bgcolor: '#fff',
            boxShadow: noShadow ? 'none' : '0px 0px 10px 0px #ddd',
            borderRadius: '10px',
            padding: 2,
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.02)',
            },
          }}
        >
          {/* Social Icon and Date */}
          <Box
            sx={{
              flexDirection: 'row',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: isDashboard ? 0.3 : 2,
            }}
          >
            {/* Instagram Icon */}
            <Box
              bgcolor={'#c13584'}
              sx={{
                height: 25,
                width: 25,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '50%',
              }}
            >
              <FaInstagram size={15} color="#fff" />
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
              {DateHelper.formatDate(post?.timestamp?.toString() ?? '')}
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

          {/* Carousel Album */}
          {post.media_type === MediaTypeEnum.CAROUSEL_ALBUM && (
            <Box height={isDashboard ? 180 : 200}>
              <MetricsCarousel
                postMedia={{
                  id: post.id,
                  data:
                    post.children?.data.map((child) => ({
                      media_type: child.media_type,
                      media_url: child.media_url,
                    })) ?? [],
                  media_url: post.media_url ?? '',
                }}
              />
            </Box>
          )}

          {/* Post Image */}
          {post.media_type === MediaTypeEnum.IMAGE && post.media_url && (
            <Box
              sx={{
                height: isDashboard ? 180 : isStory ? 250 : 200,
                width: '100%',
                mt: 1,
                borderRadius: isStory ? '100%' : 2,
                overflow: 'hidden',
                mb: 2,
                border: '2px solid #c13584',
              }}
            >
              <img
                src={post.media_url}
                alt="post"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
                loading="lazy"
              />
            </Box>
          )}

          {/* Post video */}
          {post.media_type === MediaTypeEnum.VIDEO && post.media_url && (
            <Box
              sx={{
                height: isDashboard ? 180 : isStory ? 250 : 200,
                width: '100%',
                mt: 1,
                borderRadius: isStory ? '100%' : 2,
                overflow: 'hidden',
                mb: 2,
                border: '2px solid #c13584',
              }}
            >
              <video
                controls
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
              >
                <source src={post.media_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </Box>
          )}

          {!post.media_url && (
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
              {post.media_type === 'VIDEO' ? <FaVideoSlash color="#999" size={30} /> : <CiImageOff color="#999" size={30} />}
            </Box>
          )}

          {/* Post Stats */}
          <Box sx={{ mt: 2 }} display={isDashboard ? 'flex' : 'block'} justifyContent={isDashboard ? 'space-between' : 'flex-start'} gap={1}>
            {!isStory && (
              <>
                {/* Likes */}
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
                    Likes{isDashboard ? ':' : ''}
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
                    {post.like_count ?? 0}
                  </Typography>
                </Box>

                {/* Comments */}
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
                    {post.comments_count ?? 0}
                  </Typography>
                </Box>

                {/* Engagement */}
                {!isDashboard && (
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
                      Engagement{isDashboard ? ':' : ''}
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
                      {post?.engagements_count ?? 0}
                    </Typography>
                  </Box>
                )}
              </>
            )}

            {onShowSentiments && authenticated && (
              <Box display={'flex'} justifyContent={'center'}>
                <Button
                  style={{
                    fontSize: 11,
                  }}
                  color="primary"
                  onClick={() => {
                    setSelectedPost(post.id);
                    setAction('show_sentiment');
                    setMediaType(post.media_type);
                    queryClient.invalidateQueries(['media-post-insights']);
                    if (onShowSentiments) onShowSentiments();
                  }}
                >
                  Show Engagement
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      <PostModal post={post} open={showModal} handleClose={() => setShowModal(false)} keywords={keywords} />
    </>
  );
};

export default TrackerPostCard;
