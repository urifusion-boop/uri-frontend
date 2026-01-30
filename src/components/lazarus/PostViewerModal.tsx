import { LazarusAlertEvidence } from '@/types/lazarus.types';
import CloseIcon from '@mui/icons-material/Close';
import CommentIcon from '@mui/icons-material/Comment';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PersonIcon from '@mui/icons-material/Person';
import TwitterIcon from '@mui/icons-material/Twitter';
import { Avatar, Box, Chip, Dialog, Divider, IconButton, Typography } from '@mui/material';

interface PostViewerModalProps {
  open: boolean;
  onClose: () => void;
  evidence: LazarusAlertEvidence | null;
  contactName?: string;
  contactPhoto?: string;
}

const PostViewerModal = ({ open, onClose, evidence, contactName, contactPhoto }: PostViewerModalProps) => {
  if (!evidence || !evidence.post_text) {
    return null;
  }

  const platform = evidence.post_platform || 'Unknown';
  const isLinkedIn = platform.toLowerCase().includes('linkedin');
  const isTwitter = platform.toLowerCase().includes('twitter');

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Unknown date';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const getPlatformColor = () => {
    if (isLinkedIn) return '#0077B5';
    if (isTwitter) return '#1DA1F2';
    return '#667eea';
  };

  const getPlatformIcon = () => {
    if (isLinkedIn) return <LinkedInIcon sx={{ fontSize: 24 }} />;
    if (isTwitter) return <TwitterIcon sx={{ fontSize: 24 }} />;
    return null;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 3,
          background: `linear-gradient(135deg, ${getPlatformColor()}15 0%, ${getPlatformColor()}05 100%)`,
          borderBottom: `2px solid ${getPlatformColor()}30`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            src={contactPhoto}
            sx={{
              width: 64,
              height: 64,
              border: `3px solid ${getPlatformColor()}`,
              fontSize: '24px',
              fontWeight: 700,
              background: `linear-gradient(135deg, ${getPlatformColor()} 0%, ${getPlatformColor()}CC 100%)`,
            }}
          >
            {!contactPhoto && <PersonIcon sx={{ fontSize: 32 }} />}
          </Avatar>
          <Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography fontSize="20px" fontWeight={700} color="#1a1a1a">
                {contactName || 'Contact'}
              </Typography>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '6px',
                  background: getPlatformColor(),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                }}
              >
                {getPlatformIcon()}
              </Box>
            </Box>
            <Typography fontSize="13px" color="#666">
              {formatDate(evidence.post_created_at)}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: '#666' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Post Content */}
      <Box sx={{ p: 4 }}>
        {/* Author */}
        {evidence.post_author && (
          <Box mb={2}>
            <Chip
              label={`@${evidence.post_author}`}
              size="small"
              sx={{
                background: `${getPlatformColor()}15`,
                color: getPlatformColor(),
                fontWeight: 600,
                fontSize: '12px',
              }}
            />
          </Box>
        )}

        {/* Post Text */}
        <Box
          sx={{
            p: 3,
            background: '#fff',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            mb: 3,
          }}
        >
          <Typography
            fontSize="16px"
            lineHeight={1.7}
            color="#1a1a1a"
            sx={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {evidence.post_text}
          </Typography>
        </Box>

        {/* Engagement Stats */}
        <Box display="flex" gap={3} mb={3}>
          {evidence.post_likes !== undefined && evidence.post_likes !== null && (
            <Box display="flex" alignItems="center" gap={1}>
              <FavoriteIcon sx={{ fontSize: 18, color: '#EF4444' }} />
              <Typography fontSize="14px" fontWeight={600} color="#374151">
                {evidence.post_likes.toLocaleString()} likes
              </Typography>
            </Box>
          )}
          {evidence.post_comments !== undefined && evidence.post_comments !== null && (
            <Box display="flex" alignItems="center" gap={1}>
              <CommentIcon sx={{ fontSize: 18, color: '#3B82F6' }} />
              <Typography fontSize="14px" fontWeight={600} color="#374151">
                {typeof evidence.post_comments === 'number' ? evidence.post_comments.toLocaleString() : evidence.post_comments} comments
              </Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* AI Analysis */}
        {evidence.signal_type && (
          <Box mb={3}>
            <Typography fontSize="12px" fontWeight={700} color="#667eea" mb={1} textTransform="uppercase" letterSpacing="0.8px">
              🎯 AI Analysis
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              <Chip label={`Signal: ${evidence.signal_type}`} size="small" sx={{ background: '#667eea15', color: '#667eea', fontWeight: 600 }} />
              {evidence.confidence && <Chip label={`Confidence: ${Math.round(evidence.confidence * 100)}%`} size="small" sx={{ background: '#10B98115', color: '#10B981', fontWeight: 600 }} />}
            </Box>
          </Box>
        )}

        {/* View Original Link */}
        {evidence.post_url && (
          <Box
            component="a"
            href={evidence.post_url}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              p: 2.5,
              background: `linear-gradient(135deg, ${getPlatformColor()}10 0%, ${getPlatformColor()}05 100%)`,
              borderRadius: '12px',
              border: `2px solid ${getPlatformColor()}30`,
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: getPlatformColor(),
                boxShadow: `0 4px 12px ${getPlatformColor()}30`,
              },
            }}
          >
            <OpenInNewIcon sx={{ fontSize: 20, color: getPlatformColor() }} />
            <Typography fontSize="14px" fontWeight={600} color={getPlatformColor()}>
              View original post on {platform}
            </Typography>
          </Box>
        )}
      </Box>
    </Dialog>
  );
};

export default PostViewerModal;
