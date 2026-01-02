/**
 * SpamDetailsModal - Detailed view of spam/unqualified leads
 * PRD Feature 1: Spam Visibility - Section 3.4, 3.5
 *
 * NEW COMPONENT - Does not modify existing modals
 */

import { useSpamReasonColor } from '@/hooks/spam/useSpamLeads.hook';
import { SpamLeadDto } from '@/models/dtos/SpamLeadDto';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, LinearProgress, Link, TextField, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';

interface SpamDetailsModalProps {
  open: boolean;
  onClose: () => void;
  spam: SpamLeadDto | null;
  onPromote: (spamId: string) => void;
  onUpdateNotes?: (spamId: string, notes: string) => void;
  isPromoting?: boolean;
}

const SpamDetailsModal = ({ open, onClose, spam, onPromote, onUpdateNotes, isPromoting = false }: SpamDetailsModalProps) => {
  const { getReasonColor } = useSpamReasonColor();
  const [notes, setNotes] = useState(spam?.user_notes || '');

  if (!spam) return null;

  const handleCopyLink = () => {
    if (spam.display_link) {
      navigator.clipboard.writeText(spam.display_link);
    }
  };

  const handlePromote = () => {
    onPromote(spam.spam_id);
    onClose();
  };

  const handleSaveNotes = () => {
    if (onUpdateNotes && notes !== spam.user_notes) {
      onUpdateNotes(spam.spam_id, notes);
    }
  };

  // Score helper
  const renderScore = (label: string, score: number | undefined, threshold?: number) => {
    if (score === undefined) return null;

    const percentage = Math.round(score * 100);
    const isBelowThreshold = threshold && score < threshold;

    return (
      <Box sx={{ mb: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
          <Typography fontSize="13px" fontWeight={600} color="#374151">
            {label}
          </Typography>
          <Typography fontSize="13px" fontWeight={700} color={isBelowThreshold ? '#FF5252' : '#10B981'}>
            {percentage}%
            {threshold && (
              <Typography component="span" fontSize="11px" color="#6C727F" ml={0.5}>
                (min: {Math.round(threshold * 100)}%)
              </Typography>
            )}
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={percentage}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: '#E5E7EB',
            '& .MuiLinearProgress-bar': {
              backgroundColor: isBelowThreshold ? '#FF5252' : '#10B981',
              borderRadius: 4,
            },
          }}
        />
      </Box>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 2 }}>
        <Typography variant="h6" fontWeight={600} color="#374151">
          Unqualified Lead Details
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        {/* Title & Company */}
        <Box mb={3}>
          <Typography fontSize="18px" fontWeight={700} color="#111827" mb={1}>
            {spam.display_title || 'Untitled'}
          </Typography>
          {spam.display_company && (
            <Typography fontSize="14px" color="#6C727F">
              {spam.display_company}
            </Typography>
          )}
        </Box>

        {/* Source & Reason Chips */}
        <Box display="flex" gap={1} mb={3} flexWrap="wrap">
          <Chip label={spam.lead_source} size="small" sx={{ backgroundColor: '#F3F4F6', fontWeight: 600 }} />
          <Chip
            label={spam.spam_reason}
            size="small"
            sx={{
              backgroundColor: getReasonColor(spam.spam_reason),
              color: '#fff',
              fontWeight: 600,
            }}
          />
          <Chip label={spam.filter_stage.replace('_', ' ').toUpperCase()} size="small" variant="outlined" />
        </Box>

        {/* Why Filtered Section */}
        <Box
          sx={{
            backgroundColor: '#FFF3CD',
            border: '2px solid #FF9800',
            borderRadius: '8px',
            p: 2,
            mb: 3,
          }}
        >
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <WarningAmberIcon sx={{ color: '#FF9800' }} />
            <Typography fontWeight={700} fontSize="14px" color="#856404">
              Why This Was Filtered
            </Typography>
          </Box>
          <Typography fontSize="13px" color="#856404">
            {spam.spam_reason_detail || spam.spam_reason}
          </Typography>
        </Box>

        {/* Scores Section */}
        {(spam.intent_score || spam.relevance_score || spam.commercial_relevance) && (
          <Box mb={3}>
            <Typography fontWeight={700} fontSize="14px" color="#374151" mb={2}>
              📊 Analysis Scores
            </Typography>

            {/* Social Post Scores */}
            {spam.intent_score !== undefined && renderScore('Intent Score', spam.intent_score, 0.55)}
            {spam.relevance_score !== undefined && renderScore('Relevance Score', spam.relevance_score, 0.5)}
            {spam.final_score !== undefined && renderScore('Final Score', spam.final_score, 0.6)}

            {/* Job Board Scores */}
            {spam.commercial_relevance !== undefined && renderScore('Commercial Relevance', spam.commercial_relevance, 0.3)}
            {spam.problem_solution_match !== undefined && renderScore('Problem-Solution Match', spam.problem_solution_match)}
            {spam.hiring_intent_score !== undefined && renderScore('Hiring Intent', spam.hiring_intent_score)}
            {spam.company_confidence !== undefined && renderScore('Company Confidence', spam.company_confidence)}
          </Box>
        )}

        {/* Sentiment (if available) */}
        {spam.sentiment && (
          <Box mb={3}>
            <Typography fontSize="13px" color="#6C727F" mb={0.5}>
              Sentiment:
            </Typography>
            <Chip label={spam.sentiment} size="small" color={spam.sentiment.toLowerCase() === 'positive' ? 'success' : spam.sentiment.toLowerCase() === 'negative' ? 'error' : 'default'} />
          </Box>
        )}

        {/* Links */}
        {spam.display_link && (
          <Box mb={3}>
            <Typography fontWeight={700} fontSize="14px" color="#374151" mb={1}>
              🔗 Links
            </Typography>
            <Box display="flex" gap={1}>
              <Link href={spam.display_link} target="_blank" rel="noopener" underline="none">
                <Button size="small" variant="outlined" startIcon={<OpenInNewIcon />} sx={{ textTransform: 'none' }}>
                  View Original Post
                </Button>
              </Link>
              <Tooltip title="Copy link">
                <IconButton size="small" onClick={handleCopyLink}>
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        )}

        {/* Notes */}
        <Box>
          <Typography fontWeight={700} fontSize="14px" color="#374151" mb={1}>
            📝 Your Notes
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about this lead..."
            variant="outlined"
            size="small"
            sx={{
              backgroundColor: '#F7F7FD',
              '& .MuiOutlinedInput-root': {
                borderColor: '#E0DEF7',
              },
            }}
          />
          {notes !== spam.user_notes && (
            <Button size="small" onClick={handleSaveNotes} sx={{ mt: 1, textTransform: 'none' }}>
              Save Notes
            </Button>
          )}
        </Box>

        {/* Search Context */}
        <Box mt={2}>
          <Typography fontSize="12px" color="#9CA3AF">
            Search Keyword: <strong>{spam.search_keyword}</strong> • {new Date(spam.created_at).toLocaleString()}
          </Typography>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={onClose} variant="outlined" sx={{ textTransform: 'none' }}>
          Close
        </Button>
        <Button
          onClick={handlePromote}
          variant="contained"
          disabled={isPromoting}
          sx={{
            backgroundColor: '#10B981',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#059669',
            },
          }}
        >
          {isPromoting ? 'Promoting...' : 'Add to Leads'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SpamDetailsModal;
