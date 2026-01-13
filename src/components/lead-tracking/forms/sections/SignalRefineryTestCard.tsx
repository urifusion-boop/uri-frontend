/**
 * Signal Refinery Test Card
 *
 * Separate test card for Google X-Ray method testing
 * Does NOT interfere with existing lead forms
 */

import ScienceIcon from '@mui/icons-material/Science';
import { Box, Button, Grid, Typography } from '@mui/material';
import { useRouter } from 'next/router';

const SignalRefineryTestCard = () => {
  const router = useRouter();

  const handleOpenTest = () => {
    router.push('/signal-refinery-test-page');
  };

  return (
    <Grid item xs={12} sm={6} lg={4}>
      <Box
        sx={{
          borderRadius: '14px',
          position: 'relative',
          background: 'linear-gradient(135deg, #FFF5F7 0%, #FFF 100%)',
          boxShadow: '0 2px 8px rgba(255,140,0,0.1)',
          border: '2px dashed #FF8C00',
          overflow: 'hidden',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 12px 24px rgba(255,140,0,0.2)',
            transform: 'translateY(-4px)',
            borderColor: '#FF6B00',
          },
        }}
      >
        {/* Header with Beta Badge */}
        <Box
          sx={{
            px: 3,
            py: 2.5,
            borderBottom: '1px solid #FFE4CC',
            background: 'linear-gradient(90deg, #FFF8F0 0%, #FFF 100%)',
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: '9px',
                  background: 'linear-gradient(135deg, #FF8C00 0%, #FF6B00 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  boxShadow: '0 2px 8px rgba(255,140,0,0.4)',
                }}
              >
                <ScienceIcon fontSize="small" />
              </Box>
              <Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography fontSize="17px" fontWeight={700} color="#111827" lineHeight={1.3} letterSpacing="-0.01em">
                    🧪 Signal Refinery
                  </Typography>
                  <Box
                    sx={{
                      px: 1,
                      py: 0.25,
                      background: '#FF8C00',
                      borderRadius: '4px',
                    }}
                  >
                    <Typography fontSize="9px" fontWeight={700} color="#fff" letterSpacing="0.5px">
                      TEST
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="caption" sx={{ color: '#FF6B00', fontSize: '12px', fontWeight: 600, mt: 0.25 }}>
                  Google X-Ray Method
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ px: 2.5, py: 2.5, display: 'flex', flexDirection: 'column', flex: 1 }}>
          {/* Info Box */}
          <Box
            sx={{
              px: 2,
              py: 1.5,
              mb: 2.5,
              background: '#FFF8F0',
              borderRadius: '10px',
              border: '1px solid #FFE4CC',
            }}
          >
            <Typography fontSize="11px" color="#FF6B00" fontWeight={600} mb={0.5}>
              EXPERIMENTAL FEATURE
            </Typography>
            <Typography fontSize="12px" color="#666" lineHeight={1.4}>
              Test the "Signal Refinery" architecture - Google X-Ray search with buyer/seller classification
            </Typography>
          </Box>

          {/* Features List */}
          <Box mb={2.5} flex={1}>
            <Typography fontSize="12px" color="#374151" fontWeight={600} mb={1}>
              What's Different:
            </Typography>
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              <Typography component="li" fontSize="11px" color="#6B7280" mb={0.5}>
                ✓ Google search instead of direct scraping
              </Typography>
              <Typography component="li" fontSize="11px" color="#6B7280" mb={0.5}>
                ✓ Pre-filtered spam (80-90% cleaner)
              </Typography>
              <Typography component="li" fontSize="11px" color="#6B7280" mb={0.5}>
                ✓ LLM buyer/seller classification
              </Typography>
              <Typography component="li" fontSize="11px" color="#6B7280" mb={0.5}>
                ✓ Nairaland forum scraping
              </Typography>
              <Typography component="li" fontSize="11px" color="#6B7280">
                ✓ Cost comparison vs traditional
              </Typography>
            </Box>
          </Box>

          {/* Action Button */}
          <Button
            fullWidth
            variant="contained"
            onClick={handleOpenTest}
            sx={{
              background: 'linear-gradient(135deg, #FF8C00 0%, #FF6B00 100%)',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '13px',
              py: 1.25,
              borderRadius: '8px',
              boxShadow: '0 4px 10px rgba(255,140,0,0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #FF6B00 0%, #FF8C00 100%)',
                boxShadow: '0 6px 16px rgba(255,140,0,0.4)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Open Test System
          </Button>

          {/* Disclaimer */}
          <Typography fontSize="9px" color="#999" textAlign="center" mt={1.5} fontStyle="italic">
            Isolated test system - won't affect production leads
          </Typography>
        </Box>
      </Box>
    </Grid>
  );
};

export default SignalRefineryTestCard;
