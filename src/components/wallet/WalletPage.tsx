import Spinner from '@/components/loaders/Spinner';
import { LightThemeColors } from '@/configs/colors.config';
import { NumberHelper } from '@/helpers/NumberHelper';
import { useCreditBundle } from '@/hooks/credits/useCreditBundle';
import { useWallet } from '@/hooks/wallet/useWallet';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  Skeleton,
  Stack,
  TableCell,
  TableRow,
  TextField,
  Typography,
  alpha,
  styled,
} from '@mui/material';
import { useState } from 'react';
import { FaCoins, FaTimes } from 'react-icons/fa';
import { CreditBundleSection } from './CreditBundleSection';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  color: '#666',
}));

const HoverRow = styled(TableRow)(({ theme }) => ({
  transition: 'background-color 150ms ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
  },
}));

const MIN_FUNDING_AMOUNT = 5000;

export const WalletPage = () => {
  const { balance, currency, transactions, isLoadingWallet, isWalletError, fundWallet, isFunding } = useWallet();
  const { creditsAvailable, creditsUsed, totalCredits, isLoadingBalance, purchaseHistory, isLoadingHistory } = useCreditBundle();
  const [openFundModal, setOpenFundModal] = useState(false);
  const [amount, setAmount] = useState('');

  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const creditCount = transactions.filter((t) => t.type === 'credit').length;
  const debitCount = transactions.filter((t) => t.type === 'debit').length;
  const lastActivity = sortedTransactions[0]?.date;

  const handleFund = async () => {
    if (!amount || isNaN(Number(amount))) return;
    const numAmount = Number(amount);
    if (numAmount < MIN_FUNDING_AMOUNT) return;

    await fundWallet({ amount: numAmount, currency: 'NGN' });
    setOpenFundModal(false);
    setAmount('');
  };

  const isAmountInvalid = Number(amount) > 0 && Number(amount) < MIN_FUNDING_AMOUNT;

  const renderStatus = (status: string) => {
    const normalized = status?.toLowerCase?.() ?? '';
    const color = normalized === 'success' ? 'success' : normalized === 'failed' ? 'error' : 'warning';

    return (
      <Chip
        size="small"
        label={normalized || 'pending'}
        color={color as any}
        sx={{
          textTransform: 'capitalize',
          fontWeight: 700,
        }}
      />
    );
  };

  return (
    <Box
      sx={{
        px: { xs: 2, md: 3 },
        py: { xs: 2, md: 3 },
        maxWidth: 1200,
        mx: 'auto',
      }}
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} gap={2} mb={3}>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ color: '#141414' }}>
            Credit Balance
          </Typography>
          <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
            Manage your credits and purchase history
          </Typography>
        </Box>
      </Stack>

      {isWalletError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
          Unable to load wallet right now. Please refresh.
        </Alert>
      )}

      {/* Compact Full-Width Credit Balance Card */}
      <Card
        sx={{
          borderRadius: 4,
          overflow: 'hidden',
          color: 'white',
          background: `linear-gradient(135deg, ${LightThemeColors.uriColor} 0%, ${alpha(LightThemeColors.uriColor, 0.85)} 100%)`,
          boxShadow: '0 12px 35px rgba(205, 27, 120, 0.15)',
          position: 'relative',
          mb: 3,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -30,
            right: -30,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: alpha('#fff', 0.06),
          }}
        />
        <CardContent sx={{ p: 2.5, position: 'relative', zIndex: 1 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255,255,255,0.18)',
                    border: '1px solid rgba(255,255,255,0.25)',
                  }}
                >
                  <FaCoins size={22} />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ opacity: 0.85, fontWeight: 600, fontSize: '0.7rem' }}>
                    AVAILABLE CREDITS
                  </Typography>
                  {isLoadingBalance ? (
                    <Skeleton variant="text" width={60} height={36} sx={{ bgcolor: 'rgba(255,255,255,0.25)' }} />
                  ) : (
                    <Typography variant="h4" fontWeight={900} sx={{ lineHeight: 1.1 }}>
                      {NumberHelper.formatNumber(creditsAvailable)}
                    </Typography>
                  )}
                </Box>
              </Stack>
            </Grid>

            <Grid item xs={6} sm={3} md={2}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2.5,
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  textAlign: 'center',
                }}
              >
                <Typography variant="caption" sx={{ opacity: 0.85, fontWeight: 600, fontSize: '0.7rem' }}>
                  USED
                </Typography>
                <Typography variant="h6" fontWeight={900}>
                  {isLoadingBalance ? <Skeleton width={30} sx={{ bgcolor: 'rgba(255,255,255,0.25)', mx: 'auto' }} /> : NumberHelper.formatNumber(creditsUsed)}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={6} sm={3} md={2}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2.5,
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  textAlign: 'center',
                }}
              >
                <Typography variant="caption" sx={{ opacity: 0.85, fontWeight: 600, fontSize: '0.7rem' }}>
                  TOTAL
                </Typography>
                <Typography variant="h6" fontWeight={900}>
                  {isLoadingBalance ? <Skeleton width={30} sx={{ bgcolor: 'rgba(255,255,255,0.25)', mx: 'auto' }} /> : NumberHelper.formatNumber(totalCredits)}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={12} md={5}>
              <Card sx={{ borderRadius: 2.5, background: alpha('#27ae60', 0.15), border: `1px solid ${alpha('#27ae60', 0.3)}` }}>
                <CardContent sx={{ p: 1.75 }}>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 2,
                        background: alpha('#27ae60', 0.3),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                      }}
                    >
                      <FaCoins size={18} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" sx={{ color: 'white', fontWeight: 600, opacity: 0.95, fontSize: '0.7rem' }}>
                        Need more credits?
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'white', fontWeight: 800, mt: 0.2, fontSize: '0.875rem' }}>
                        Purchase bundles or custom plan below
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Dialog
        open={openFundModal}
        onClose={() => setOpenFundModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: 'hidden',
          },
        }}
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography fontWeight={900} sx={{ color: '#141414' }}>
                Fund wallet
              </Typography>
              <Typography variant="body2" sx={{ color: '#6B6B6B', mt: 0.25 }}>
                Minimum funding is ₦{NumberHelper.formatNumber(MIN_FUNDING_AMOUNT)}
              </Typography>
            </Box>
            <IconButton onClick={() => setOpenFundModal(false)}>
              <FaTimes />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box py={2}>
            <TextField
              label="Amount"
              type="number"
              fullWidth
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              error={isAmountInvalid}
              helperText={isAmountInvalid ? `Minimum amount is ₦${NumberHelper.formatNumber(MIN_FUNDING_AMOUNT)}` : ' '}
              InputProps={{
                startAdornment: <InputAdornment position="start">₦</InputAdornment>,
                inputProps: { min: MIN_FUNDING_AMOUNT },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
            />

            <Box mt={1}>
              <Typography variant="caption" sx={{ color: '#8A8A8A', fontWeight: 700 }}>
                Quick amounts
              </Typography>
              <Stack direction="row" gap={1} flexWrap="wrap" mt={1}>
                {[5000, 10000, 25000, 50000].map((v) => (
                  <Chip
                    key={v}
                    label={`₦${NumberHelper.formatNumber(v)}`}
                    clickable
                    onClick={() => setAmount(String(v))}
                    sx={{
                      borderRadius: 999,
                      fontWeight: 900,
                      backgroundColor: alpha('#CD1B78', 0.06),
                      border: `1px solid ${alpha('#CD1B78', 0.18)}`,
                      color: '#8E1354',
                    }}
                  />
                ))}
              </Stack>
            </Box>

            <Box mt={3}>
              <Button
                variant="contained"
                onClick={handleFund}
                disabled={!amount || Number(amount) < MIN_FUNDING_AMOUNT || isFunding}
                fullWidth
                sx={{
                  borderRadius: 3,
                  py: 1.25,
                  fontWeight: 900,
                  backgroundColor: LightThemeColors.uriColor,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.10)',
                  '&:hover': { backgroundColor: '#B8186A', boxShadow: '0 12px 35px rgba(0,0,0,0.12)' },
                }}
              >
                {isFunding ? <Spinner size={20} color="white" /> : 'Proceed to Payment'}
              </Button>
              <Typography variant="caption" sx={{ color: '#8A8A8A', display: 'block', mt: 1, textAlign: 'center' }}>
                You'll be redirected to complete payment.
              </Typography>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Credit Bundles Section */}
      <CreditBundleSection />
    </Box>
  );
};
