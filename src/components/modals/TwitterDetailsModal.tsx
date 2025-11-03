import { LeadDto } from '@/models/dtos/LeadsDto';
import { Dialog, DialogTitle, DialogContent, Box, Typography, IconButton, Chip, Link, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkIcon from '@mui/icons-material/Link';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';

interface TwitterDetailsModalProps {
  open: boolean;
  onClose: () => void;
  lead: LeadDto | null;
}

const TwitterDetailsModal = ({ open, onClose, lead }: TwitterDetailsModalProps) => {
  if (!lead) return null;

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
          <TwitterIcon sx={{ color: '#1DA1F2' }} />
          <Typography variant="h6" fontWeight={600}>
            Twitter Lead Details
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

        {/* Tweet Content */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ mb: 1 }}>
            Tweet Content
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

        {/* Twitter URL */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <LinkIcon sx={{ color: '#6b7280', fontSize: 20 }} />
            <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
              Tweet URL
            </Typography>
          </Box>
          <Link
            href={lead.lead_link || lead.website_url}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              ml: 3.5,
              display: 'block',
              color: '#1DA1F2',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
              wordBreak: 'break-all',
            }}
          >
            {lead.lead_link || lead.website_url}
          </Link>
        </Box>

        {/* Twitter Profile URL */}
        {lead.twitter_url && (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <TwitterIcon sx={{ color: '#6b7280', fontSize: 20 }} />
              <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
                Twitter Profile
              </Typography>
            </Box>
            <Link
              href={lead.twitter_url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                ml: 3.5,
                display: 'block',
                color: '#1DA1F2',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
                wordBreak: 'break-all',
              }}
            >
              {lead.twitter_url}
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
