/**
 * Lazarus Protocol Card
 *
 * PRD: The Lazarus Protocol - CRM Resurrection Engine
 * Monitors dead leads for buying signals (job changes, hiring sprees, pivots)
 */

import AutorenewIcon from '@mui/icons-material/Autorenew';
import { Box, Button, Grid, Typography } from '@mui/material';
import { useRouter } from 'next/router';

const LazarusProtocolCard = () => {
  const router = useRouter();

  const handleOpenLazarus = () => {
    router.push('/lazarus');
  };

  return (
    <Grid item xs={12} sm={6} lg={4}>
      <Box
        sx={{
          borderRadius: '14px',
          position: 'relative',
          background: 'linear-gradient(135deg, #F0F4FF 0%, #FFF 100%)',
          boxShadow: '0 2px 8px rgba(99,102,241,0.1)',
          border: '2px solid #6366F1',
          overflow: 'hidden',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 12px 24px rgba(99,102,241,0.2)',
            transform: 'translateY(-4px)',
            borderColor: '#4F46E5',
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            px: 3,
            py: 2.5,
            borderBottom: '1px solid #E0E7FF',
            background: 'linear-gradient(90deg, #F0F4FF 0%, #FFF 100%)',
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: '9px',
                  background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  boxShadow: '0 2px 8px rgba(99,102,241,0.4)',
                }}
              >
                <AutorenewIcon fontSize="small" />
              </Box>
              <Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography fontSize="17px" fontWeight={700} color="#111827" lineHeight={1.3} letterSpacing="-0.01em">
                    ⚡ The Prospect Pulse
                  </Typography>
                  <Box
                    sx={{
                      px: 1,
                      py: 0.25,
                      background: '#10B981',
                      borderRadius: '4px',
                    }}
                  >
                    <Typography fontSize="9px" fontWeight={700} color="#fff" letterSpacing="0.5px">
                      NEW
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="caption" sx={{ color: '#6366F1', fontSize: '12px', fontWeight: 600, mt: 0.25 }}>
                  Active Signals for High-Ticket Leads
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
              background: '#F0F4FF',
              borderRadius: '10px',
              border: '1px solid #E0E7FF',
            }}
          >
            <Typography fontSize="11px" color="#6366F1" fontWeight={600} mb={0.5}>
              AUTOMATED MONITORING
            </Typography>
            <Typography fontSize="12px" color="#666" lineHeight={1.4}>
              Monitor dead leads for resurrection signals - job changes, hiring sprees, buying intent
            </Typography>
          </Box>

          {/* Features List */}
          <Box mb={2.5} flex={1}>
            <Typography fontSize="12px" color="#374151" fontWeight={600} mb={1}>
              What It Does:
            </Typography>
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              <Typography component="li" fontSize="11px" color="#6B7280" mb={0.5}>
                ✓ Track individuals for job exits & pain signals
              </Typography>
              <Typography component="li" fontSize="11px" color="#6B7280" mb={0.5}>
                ✓ Monitor companies for hiring sprees
              </Typography>
              <Typography component="li" fontSize="11px" color="#6B7280" mb={0.5}>
                ✓ Detect cash injections & pivots
              </Typography>
              <Typography component="li" fontSize="11px" color="#6B7280" mb={0.5}>
                ✓ Weekly background scans (Origami Method)
              </Typography>
              <Typography component="li" fontSize="11px" color="#6B7280">
                ✓ AI-generated resurrection pitches
              </Typography>
            </Box>
          </Box>

          {/* Quota Info */}
          <Box
            sx={{
              px: 2,
              py: 1,
              mb: 2,
              background: '#FFFBEB',
              borderRadius: '8px',
              border: '1px solid #FDE68A',
            }}
          >
            <Typography fontSize="10px" color="#92400E" fontWeight={600}>
              📊 BASIC: 50 slots • PRO: 500 slots
            </Typography>
          </Box>

          {/* Action Button */}
          <Button
            fullWidth
            variant="contained"
            onClick={handleOpenLazarus}
            sx={{
              background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '13px',
              py: 1.25,
              borderRadius: '8px',
              boxShadow: '0 4px 10px rgba(99,102,241,0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
                boxShadow: '0 6px 16px rgba(99,102,241,0.4)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Open Lazarus Dashboard
          </Button>

          {/* Disclaimer */}
          <Typography fontSize="9px" color="#999" textAlign="center" mt={1.5} fontStyle="italic">
            Resurrect cold leads automatically
          </Typography>
        </Box>
      </Box>
    </Grid>
  );
};

export default LazarusProtocolCard;
