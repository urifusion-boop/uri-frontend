import { Avatar, Box, Card, CardContent, CardHeader, IconButton, Typography } from '@mui/material';
import { FaHeart, FaQuoteLeft } from 'react-icons/fa';

import { TextHelper } from '@/helpers/TextHelper';
import { MediaTypeEnum } from '@/models/enum-models/MediaTypeEnum';
import dayjs from 'dayjs';
import { FaRetweet } from 'react-icons/fa6';
import { IoChatbubbleSharp } from 'react-icons/io5';
import MetricsCarousel from '../atoms/MetricsCarousel';
import PlatformIcon from '../atoms/PlatformIcons';

interface SelectedPostProps {
  selectPost: {
    title?: string;
    id?: any;
    media_url?: string;
    permalink?: string;
    timestamp?: string;
    like_count?: number;
    comments_count?: number;
    retweet_count?: number;
    quote_count?: number;
    caption?: string;
    media_type?: string;
    children?: {
      data: {
        media_type: string;
        media_url: string;
      }[];
    };
  };
  width?: string;
  maxHeight?: string;
}

const SelectedPost = ({ selectPost, width, maxHeight }: SelectedPostProps) => {
  const total_engagements = (selectPost?.like_count ?? 0) + (selectPost?.comments_count ?? 0);

  return (
    <Card
      sx={{
        boxShadow: 0,
        borderRadius: '10px',
        border: '1px solid #8C8C8C4D',
        width: width ?? '40%',
        maxHeight: maxHeight ?? 'auto',
        overflowY: 'auto',
      }}
      className="scroll"
    >
      {/* Header Section */}
      <CardHeader
        avatar={
          <a
            href={selectPost?.permalink ?? '#'}
            target={selectPost?.permalink ? '_blank' : '_self'}
            rel="noopener noreferrer"
            style={{
              pointerEvents: selectPost?.permalink ? 'auto' : 'none',
            }}
          >
            <Avatar src={selectPost?.media_url} alt="User Image" />
          </a>
        }
        title={
          <Box>
            <a
              href={selectPost?.permalink ?? '#'}
              target={selectPost?.permalink ? '_blank' : '_self'}
              rel="noopener noreferrer"
              style={{
                pointerEvents: selectPost?.permalink ? 'auto' : 'none',
              }}
            >
              <Typography
                variant="h6"
                fontWeight={600}
                sx={{
                  color: '#1E1E1E',
                  fontSize: '16px',
                }}
              >
                {TextHelper.getDomainName(selectPost?.permalink)}
              </Typography>
            </a>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <PlatformIcon platform={TextHelper.getDomainName(selectPost?.permalink)} size={16} />
              <Typography variant="body2" color="text.secondary">
                {dayjs(selectPost?.timestamp).format('DD MMM YYYY HH:mm A')}

                {total_engagements ? <>&bull; {total_engagements} Engagements</> : null}
              </Typography>
            </Box>
          </Box>
        }
      />

      {/* Middle Section (Text) */}
      <CardContent
        sx={{
          p: 0,
          pl: '40px',
        }}
      >
        {selectPost?.title && (
          <Typography
            variant="h6"
            color="text.primary"
            fontSize={16}
            dangerouslySetInnerHTML={{
              __html: selectPost?.title,
            }}
          />
        )}
        <Typography variant="body1" color="text.primary" fontSize={16}>
          {selectPost?.caption}
        </Typography>
      </CardContent>

      {/* Media Section */}
      {selectPost?.media_url && selectPost.media_type && (
        <Box
          sx={{
            padding: '20px 40px',
            borderRadius: '16px',
            maxHeight: '400px',
            minHeight: '200px',
          }}
        >
          {selectPost?.media_type === MediaTypeEnum.CAROUSEL_ALBUM ? (
            <MetricsCarousel
              postMedia={{
                id: selectPost?.id,
                data:
                  selectPost?.children?.data.map((child) => ({
                    media_type: child.media_type,
                    media_url: child.media_url,
                  })) ?? [],
                media_url: selectPost?.media_url ?? '',
              }}
            />
          ) : selectPost?.media_type === MediaTypeEnum.VIDEO ? (
            <video
              controls
              src={selectPost?.media_url}
              style={{
                width: '100%',
                height: '100%',
                maxHeight: '400px',
                borderRadius: '8px',
              }}
            />
          ) : (
            <img
              src={selectPost?.media_url}
              alt="Post Media"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '8px',
                objectFit: 'cover',
              }}
            />
          )}
        </Box>
      )}

      {/* Footer Section */}
      <Box
        sx={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: '40px',
          pb: '20px',
        }}
      >
        {selectPost?.comments_count && selectPost?.comments_count > 0 ? (
          <IconButton
            aria-label="Message"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <IoChatbubbleSharp size={18} />
            <Typography variant="body2" color="text.secondary">
              {selectPost?.comments_count}
            </Typography>
          </IconButton>
        ) : null}

        {selectPost?.like_count && selectPost?.like_count > 0 ? (
          <IconButton
            aria-label="Like"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <FaHeart size={18} />
            <Typography variant="body2" color="text.secondary">
              {selectPost?.like_count ?? 0}
            </Typography>
          </IconButton>
        ) : null}

        {selectPost?.quote_count && selectPost?.quote_count > 0 ? (
          <IconButton
            aria-label="qoute"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <FaQuoteLeft size={18} />
            <Typography variant="body2" color="text.secondary">
              {selectPost?.quote_count ?? 0}
            </Typography>
          </IconButton>
        ) : null}

        {selectPost?.retweet_count && selectPost.retweet_count > 0 ? (
          <IconButton
            aria-label="Like"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <FaRetweet size={18} />
            <Typography variant="body2" color="text.secondary">
              {selectPost?.retweet_count ?? 0}
            </Typography>
          </IconButton>
        ) : null}
      </Box>
    </Card>
  );
};

export default SelectedPost;
