import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Box, Button, Chip, Dialog, DialogContent, IconButton, Typography } from '@mui/material';

interface BusinessMismatchWarningModalProps {
  open: boolean;
  onClose: () => void;
  businessSolution: string;
  socialSearch: string;
  matchScore: number;
  reasoning: string;
  recommendation: 'proceed' | 'use_only_social' | 'use_only_job_boards' | 'update_search';
  suggestedKeywords: string[];
  onUseOnlySocial: () => void;
  onUseOnlyJobBoards: () => void;
  onUpdateSearch: () => void;
  onContinueAnyway: () => void;
}

const BusinessMismatchWarningModal = ({
  open,
  onClose,
  businessSolution,
  socialSearch,
  matchScore,
  reasoning,
  recommendation,
  suggestedKeywords,
  onUseOnlySocial,
  onUseOnlyJobBoards,
  onUpdateSearch,
  onContinueAnyway,
}: BusinessMismatchWarningModalProps) => {
  const isLowMatch = matchScore < 0.4;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(205, 27, 120, 0.15)',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #FFF0F8 0%, #FFE4F2 100%)',
          borderBottom: '1px solid #FFB3D9',
          px: 3,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          position: 'relative',
        }}
      >
        <WarningAmberIcon sx={{ color: '#CD1B78', fontSize: 28 }} />
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#CD1B78', fontSize: '1.1rem' }}>
          Potential Signal Mismatch
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 12,
            top: 12,
            color: '#CD1B78',
            '&:hover': { backgroundColor: 'rgba(205, 27, 120, 0.08)' },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ px: 3, py: 2.5 }}>
        {/* Mismatch Info */}
        <Box sx={{ mb: 2.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#333', mb: 1.5 }}>
            Your social search doesn't match what you sell:
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 1.5 }}>
            <Box>
              <Typography variant="caption" sx={{ color: '#666', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                Your Business
              </Typography>
              <Typography variant="body2" sx={{ color: '#CD1B78', fontWeight: 500, mt: 0.3 }}>
                "{businessSolution}"
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#666', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                Your Social Search
              </Typography>
              <Typography variant="body2" sx={{ color: '#FB5A36', fontWeight: 500, mt: 0.3 }}>
                "{socialSearch}"
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label={`Match: ${Math.round(matchScore * 100)}%`}
              size="small"
              sx={{
                backgroundColor: isLowMatch ? '#FFEBEE' : '#FFF3E0',
                color: isLowMatch ? '#FB5A36' : '#CD1B78',
                fontWeight: 700,
                fontSize: '0.75rem',
              }}
            />
            <Typography variant="caption" sx={{ color: '#666', fontStyle: 'italic', fontSize: '0.75rem', flex: 1 }}>
              {reasoning}
            </Typography>
          </Box>
        </Box>

        {/* Option 1: Focus on ONE signal type */}
        <Box sx={{ mb: 2.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5, color: '#333', fontSize: '0.875rem' }}>
            💡 Option I: Focus on ONE signal type
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {/* Use Only Social */}
            <Box
              onClick={onUseOnlySocial}
              sx={{
                p: 1.5,
                border: '1px solid #E0E0E0',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: '#CD1B78',
                  backgroundColor: '#FFF0F8',
                },
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem', mb: 0.3 }}>
                Use ONLY social platforms
              </Typography>
              <Typography variant="caption" sx={{ color: '#666', fontSize: '0.72rem', lineHeight: 1.4 }}>
                Find people with issues related to "{socialSearch}"
              </Typography>
            </Box>

            {/* Use Only Job Boards - Recommended */}
            <Box
              onClick={onUseOnlyJobBoards}
              sx={{
                p: 1.5,
                border: '2px solid',
                borderColor: recommendation === 'use_only_job_boards' ? '#CD1B78' : '#E0E0E0',
                borderRadius: '8px',
                backgroundColor: recommendation === 'use_only_job_boards' ? '#FFF0F8' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: '#CD1B78',
                  backgroundColor: '#FFF0F8',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.3 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                  Use ONLY job boards
                </Typography>
                {recommendation === 'use_only_job_boards' && (
                  <Chip
                    label="✓ Recommended"
                    size="small"
                    sx={{
                      height: '18px',
                      backgroundColor: '#CD1B78',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '0.65rem',
                      '& .MuiChip-label': { px: 1 },
                    }}
                  />
                )}
              </Box>
              <Typography variant="caption" sx={{ color: '#666', fontSize: '0.72rem', lineHeight: 1.4 }}>
                Find companies with hiring needs matching "{businessSolution}"
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Option 2: Suggested Keywords */}
        {suggestedKeywords.length > 0 && (
          <Box
            sx={{
              p: 1.5,
              backgroundColor: '#FFF0F8',
              borderRadius: '8px',
              border: '1px solid #FFB3D9',
              mb: 2,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: '#333', fontSize: '0.875rem' }}>
              💡 Option II: Update your search
            </Typography>
            <Typography variant="caption" sx={{ color: '#666', mb: 1, display: 'block', fontSize: '0.72rem' }}>
              Suggested keywords for better match:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
              {suggestedKeywords.map((keyword, idx) => (
                <Chip
                  key={idx}
                  label={keyword}
                  size="small"
                  sx={{
                    backgroundColor: 'white',
                    border: '1px solid #CD1B78',
                    color: '#CD1B78',
                    fontWeight: 500,
                    fontSize: '0.72rem',
                    height: '22px',
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {recommendation === 'use_only_job_boards' && (
            <Button
              variant="contained"
              startIcon={<AutoFixHighIcon sx={{ fontSize: 18 }} />}
              onClick={onUseOnlyJobBoards}
              sx={{
                backgroundColor: '#CD1B78',
                '&:hover': { backgroundColor: '#B31665' },
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.85rem',
                px: 2,
                py: 0.75,
                boxShadow: '0 2px 8px rgba(205, 27, 120, 0.25)',
              }}
            >
              Auto-Fix: Use Only Job Boards
            </Button>
          )}
          <Button
            variant="text"
            onClick={onContinueAnyway}
            sx={{
              color: '#666',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.85rem',
              px: 2,
              py: 0.75,
              '&:hover': { backgroundColor: '#F5F5F5' },
            }}
          >
            Continue Anyway
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default BusinessMismatchWarningModal;
