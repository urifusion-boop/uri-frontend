import { LeadDto } from '@/models/dtos/LeadsDto';
import { Dialog, DialogTitle, DialogContent, Box, Typography, IconButton, Chip, Link, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkIcon from '@mui/icons-material/Link';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import { SvgIconComponent } from '@mui/icons-material';

interface TwitterDetailsModalProps {
  open: boolean;
  onClose: () => void;
  lead: LeadDto | null;
}

// Platform configuration
interface PlatformConfig {
  name: string;
  icon: SvgIconComponent;
  color: string;
  contentLabel: string;
  urlLabel: string;
  profileUrlField?: keyof LeadDto;
}

const platformConfigs: Record<string, PlatformConfig> = {
  twitter: {
    name: 'Twitter',
    icon: TwitterIcon,
    color: '#1DA1F2',
    contentLabel: 'Tweet Content',
    urlLabel: 'Tweet URL',
    profileUrlField: 'twitter_url',
  },
  facebook: {
    name: 'Facebook',
    icon: FacebookIcon,
    color: '#1877F2',
    contentLabel: 'Post Content',
    urlLabel: 'Post URL',
    profileUrlField: 'facebook_url',
  },
  tiktok: {
    name: 'TikTok',
    icon: TwitterIcon, // Will need to add a TikTok icon component
    color: '#000000',
    contentLabel: 'TikTok Content',
    urlLabel: 'TikTok URL',
  },
};

const TwitterDetailsModal = ({ open, onClose, lead }: TwitterDetailsModalProps) => {
  if (!lead) return null;

  // Determine platform from lead_source
  const leadSource = lead.lead_source?.toLowerCase() || 'twitter';
  const platformConfig = platformConfigs[leadSource] || platformConfigs.twitter;
  const PlatformIcon = platformConfig.icon;

  const getSentimentColor = (sentiment: string | undefined) => {
    if (!sentiment) return 'default';
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return 'success';
      case 'negative':
        return 'error';
      case 'neutral':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PlatformIcon sx={{ color: platformConfig.color }} />
          <Typography variant="h6" fontWeight={600}>
            {platformConfig.name} Lead Details
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        {/* Author Info */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <PersonIcon sx={{ color: '#6b7280', fontSize: 20 }} />
            <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
              Author
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ ml: 3.5 }}>
            {lead.first_name || lead.username || 'Unknown'}
          </Typography>
        </Box>

        {/* Content */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ mb: 1 }}>
            {platformConfig.contentLabel}
          </Typography>
          <Box
            sx={{
              backgroundColor: '#f9fafb',
              borderRadius: 2,
              p: 2,
              border: '1px solid #e5e7eb',
            }}
          >
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
              {lead.lead_reason}
            </Typography>
          </Box>
        </Box>

        {/* Sentiment */}
        {(lead as any).sentiment && (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <SentimentSatisfiedAltIcon sx={{ color: '#6b7280', fontSize: 20 }} />
              <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
                Sentiment
              </Typography>
            </Box>
            <Box sx={{ ml: 3.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label={(lead as any).sentiment}
                color={getSentimentColor((lead as any).sentiment)}
                size="small"
                sx={{ textTransform: 'capitalize' }}
              />
              {(lead as any).confidence && (
                <Typography variant="caption" color="text.secondary">
                  Confidence: {((lead as any).confidence * 100).toFixed(0)}%
                </Typography>
              )}
            </Box>
          </Box>
        )}

        {/* Post URL */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <LinkIcon sx={{ color: '#6b7280', fontSize: 20 }} />
            <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
              {platformConfig.urlLabel}
            </Typography>
          </Box>
          <Link
            href={lead.lead_link || lead.website_url}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              ml: 3.5,
              display: 'block',
              color: platformConfig.color,
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
              wordBreak: 'break-all',
            }}
          >
            {lead.lead_link || lead.website_url}
          </Link>
        </Box>

        {/* Profile URL */}
        {platformConfig.profileUrlField && lead[platformConfig.profileUrlField] && (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <PlatformIcon sx={{ color: '#6b7280', fontSize: 20 }} />
              <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
                {platformConfig.name} Profile
              </Typography>
            </Box>
            <Link
              href={lead[platformConfig.profileUrlField] as string}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                ml: 3.5,
                display: 'block',
                color: platformConfig.color,
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
                wordBreak: 'break-all',
              }}
            >
              {lead[platformConfig.profileUrlField] as string}
            </Link>
          </Box>
        )}

        {/* Created Date */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <CalendarTodayIcon sx={{ color: '#6b7280', fontSize: 20 }} />
            <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
              Posted On
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ ml: 3.5 }}>
            {lead.created_date ? new Date(lead.created_date).toLocaleString() : 'N/A'}
          </Typography>
        </Box>

        {/* Lead Status & Type */}
        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ mb: 1 }}>
              Lead Status
            </Typography>
            <Chip label={lead.lead_status || 'N/A'} size="small" />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ mb: 1 }}>
              Opportunity Type
            </Typography>
            <Chip label={lead.opportunity_type || 'N/A'} size="small" />
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default TwitterDetailsModal;