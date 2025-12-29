import { LeadDto } from '@/models/dtos/LeadsDto';
import { LeadSourceEnum } from '@/models/enum-models/LeadSourceEnum';
import { SvgIconComponent } from '@mui/icons-material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkIcon from '@mui/icons-material/Link';
import PersonIcon from '@mui/icons-material/Person';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TwitterIcon from '@mui/icons-material/Twitter';
import WorkIcon from '@mui/icons-material/Work';
import { Box, Chip, Dialog, DialogContent, DialogTitle, Divider, IconButton, Link, Typography } from '@mui/material';

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
  job_boards: {
    name: 'Job Board',
    icon: WorkIcon,
    color: '#2563eb',
    contentLabel: 'Job Description',
    urlLabel: 'Job Posting URL',
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
              <Chip label={(lead as any).sentiment} color={getSentimentColor((lead as any).sentiment)} size="small" sx={{ textTransform: 'capitalize' }} />
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

        {/* Job Signal-Specific Fields */}
        {lead.lead_source === LeadSourceEnum.JOB_BOARDS && (
          <>
            {/* Job Details */}
            {(lead.hiring_company || lead.job_title_field || lead.job_posting_url) && (
              <Box sx={{ mb: 3, p: 2, backgroundColor: '#eff6ff', borderRadius: 2, border: '1px solid #bfdbfe' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <WorkIcon sx={{ color: '#2563eb', fontSize: 20 }} />
                  <Typography variant="subtitle2" fontWeight={600} color="#1e40af">
                    Job Posting Details
                  </Typography>
                </Box>
                {lead.hiring_company && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Company:</strong> {lead.hiring_company}
                  </Typography>
                )}
                {lead.job_title_field && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Position:</strong> {lead.job_title_field}
                  </Typography>
                )}
                {lead.job_source && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Source:</strong> {lead.job_source}
                  </Typography>
                )}
                {lead.job_posting_url && (
                  <Link
                    href={lead.job_posting_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      display: 'block',
                      color: '#2563eb',
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' },
                      fontSize: '0.875rem',
                      mt: 1,
                    }}
                  >
                    View Job Posting →
                  </Link>
                )}
              </Box>
            )}

            {/* Signal Scores */}
            {(lead.commercial_relevance !== undefined || lead.problem_solution_match !== undefined || lead.hiring_intent_score !== undefined) && (
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <TrendingUpIcon sx={{ color: '#6b7280', fontSize: 20 }} />
                  <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
                    Signal Scores
                  </Typography>
                </Box>
                <Box sx={{ ml: 3.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {lead.commercial_relevance !== undefined && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Commercial Relevance:</Typography>
                      <Chip
                        label={`${(lead.commercial_relevance * 100).toFixed(0)}%`}
                        size="small"
                        color={lead.commercial_relevance >= 0.7 ? 'success' : lead.commercial_relevance >= 0.5 ? 'warning' : 'default'}
                      />
                    </Box>
                  )}
                  {lead.problem_solution_match !== undefined && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Problem-Solution Match:</Typography>
                      <Chip label={`${(lead.problem_solution_match * 100).toFixed(0)}%`} size="small" />
                    </Box>
                  )}
                  {lead.hiring_intent_score !== undefined && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Hiring Intent:</Typography>
                      <Chip label={`${(lead.hiring_intent_score * 100).toFixed(0)}%`} size="small" />
                    </Box>
                  )}
                </Box>
              </Box>
            )}

            {/* Implied Problems */}
            {lead.implied_problems && lead.implied_problems.length > 0 && (
              <Box sx={{ mb: 3, p: 2, backgroundColor: '#fef3c7', borderRadius: 2, border: '1px solid #fcd34d' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <ErrorOutlineIcon sx={{ color: '#d97706', fontSize: 20 }} />
                  <Typography variant="subtitle2" fontWeight={600} color="#92400e">
                    Implied Business Problems
                  </Typography>
                </Box>
                <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                  {lead.implied_problems.map((problem, index) => (
                    <Typography key={index} component="li" variant="body2" sx={{ color: '#78350f', mb: 0.5 }}>
                      {problem}
                    </Typography>
                  ))}
                </Box>
              </Box>
            )}
          </>
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
