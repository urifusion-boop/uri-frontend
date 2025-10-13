import { RealtimeLeadDto } from '@/models/dtos/RealtimeLeadDto';
import { Box, Typography, Avatar, Chip, IconButton, Collapse, Button } from '@mui/material';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import { BrowsercloudPlatformEnum, PlatformDisplayNames } from '@/models/enum-models/BrowsercloudPlatformEnum';
import { formatDistanceToNow } from 'date-fns';

interface RealtimeLeadNotificationProps {
  lead: RealtimeLeadDto;
  onDismiss?: () => void;
  onViewDetails?: (lead: RealtimeLeadDto) => void;
}

const PlatformIcons: Record<BrowsercloudPlatformEnum, React.ReactNode> = {
  [BrowsercloudPlatformEnum.TWITTER]: <TwitterIcon sx={{ fontSize: 16 }} />,
  [BrowsercloudPlatformEnum.LINKEDIN]: <LinkedInIcon sx={{ fontSize: 16 }} />,
  [BrowsercloudPlatformEnum.FACEBOOK]: <FacebookIcon sx={{ fontSize: 16 }} />,
  [BrowsercloudPlatformEnum.THREADS]: (
    <Box sx={{ fontSize: 14, fontWeight: 'bold', fontFamily: 'monospace' }}>@</Box>
  ),
};

const RealtimeLeadNotification: React.FC<RealtimeLeadNotificationProps> = ({
  lead,
  onDismiss,
  onViewDetails,
}) => {
  const [expanded, setExpanded] = useState(false);

  const { source, ai_analysis, lead_score } = lead;

  const getScoreColor = (score?: number) => {
    if (!score) return '#6b7280';
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const timeAgo = formatDistanceToNow(new Date(source.posted_at), { addSuffix: true });

  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        p: 2,
        mb: 2,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        transition: 'all 0.3s',
        '&:hover': {
          boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
        },
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
          <Avatar
            src={source.author_url}
            alt={source.author_name}
            sx={{ width: 40, height: 40 }}
          >
            {source.author_name.charAt(0).toUpperCase()}
          </Avatar>

          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1f2937' }}>
                {source.author_name}
              </Typography>
              <Chip
                icon={PlatformIcons[source.platform]}
                label={PlatformDisplayNames[source.platform]}
                size="small"
                sx={{
                  height: 20,
                  fontSize: '11px',
                  backgroundColor: '#f3f4f6',
                  color: '#4b5563',
                }}
              />
            </Box>

            <Typography variant="caption" sx={{ color: '#6b7280' }}>
              @{source.author_handle} • {timeAgo}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {lead_score && (
            <Chip
              label={`${lead_score}%`}
              size="small"
              sx={{
                backgroundColor: getScoreColor(lead_score),
                color: '#fff',
                fontWeight: 600,
                fontSize: '12px',
              }}
            />
          )}

          <IconButton size="small" onClick={onDismiss}>
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Box>

      {/* Post Content Preview */}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="body2"
          sx={{
            color: '#374151',
            display: '-webkit-box',
            WebkitLineClamp: expanded ? 'unset' : 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.5,
          }}
        >
          {source.post_content}
        </Typography>

        {source.post_content.length > 150 && (
          <Button
            size="small"
            endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            onClick={() => setExpanded(!expanded)}
            sx={{ mt: 0.5, fontSize: '12px', textTransform: 'none' }}
          >
            {expanded ? 'Show less' : 'Show more'}
          </Button>
        )}
      </Box>

      {/* Matched Keywords & Signals */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
        {source.matched_keywords.map((keyword, index) => (
          <Chip
            key={`keyword-${index}`}
            label={keyword}
            size="small"
            sx={{
              backgroundColor: '#dbeafe',
              color: '#1e40af',
              fontSize: '11px',
              height: 22,
            }}
          />
        ))}
        {source.matched_signals.map((signal, index) => (
          <Chip
            key={`signal-${index}`}
            label={signal}
            size="small"
            sx={{
              backgroundColor: '#fef3c7',
              color: '#92400e',
              fontSize: '11px',
              height: 22,
            }}
          />
        ))}
      </Box>

      {/* AI Analysis */}
      <Collapse in={expanded}>
        {ai_analysis && (
          <Box
            sx={{
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              p: 2,
              mb: 2,
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#4b5563', mb: 1, display: 'block' }}>
              AI Analysis
            </Typography>
            <Typography variant="caption" sx={{ color: '#6b7280', mb: 1, display: 'block' }}>
              {ai_analysis.summary}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Chip
                label={ai_analysis.opportunity_type}
                size="small"
                sx={{ fontSize: '10px', height: 20 }}
              />
              <Chip
                label={ai_analysis.interest_level}
                size="small"
                sx={{ fontSize: '10px', height: 20 }}
              />
            </Box>
          </Box>
        )}

        {/* Engagement Metrics */}
        {source.engagement_metrics && (
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            {source.engagement_metrics.likes && (
              <Typography variant="caption" sx={{ color: '#6b7280' }}>
                ❤️ {source.engagement_metrics.likes}
              </Typography>
            )}
            {source.engagement_metrics.comments && (
              <Typography variant="caption" sx={{ color: '#6b7280' }}>
                💬 {source.engagement_metrics.comments}
              </Typography>
            )}
            {source.engagement_metrics.shares && (
              <Typography variant="caption" sx={{ color: '#6b7280' }}>
                🔄 {source.engagement_metrics.shares}
              </Typography>
            )}
            {source.engagement_metrics.followers && (
              <Typography variant="caption" sx={{ color: '#6b7280' }}>
                👥 {source.engagement_metrics.followers} followers
              </Typography>
            )}
          </Box>
        )}
      </Collapse>

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          size="small"
          variant="outlined"
          startIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
          onClick={() => window.open(source.post_url, '_blank')}
          sx={{
            textTransform: 'none',
            fontSize: '12px',
            borderColor: '#e5e7eb',
            color: '#4b5563',
          }}
        >
          View Post
        </Button>

        <Button
          size="small"
          variant="contained"
          onClick={() => onViewDetails?.(lead)}
          sx={{
            textTransform: 'none',
            fontSize: '12px',
            backgroundColor: '#3b82f6',
            '&:hover': {
              backgroundColor: '#2563eb',
            },
          }}
        >
          View Details
        </Button>
      </Box>
    </Box>
  );
};

export default RealtimeLeadNotification;
