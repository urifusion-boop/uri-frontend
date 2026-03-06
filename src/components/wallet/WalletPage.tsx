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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  alpha,
  styled,
} from '@mui/material';
import { useRouter } from 'next/router';
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
  const router = useRouter();
  const { balance, currency, transactions, isLoadingWallet, isWalletError, fundWallet, isFunding } = useWallet();
  const { creditsAvailable, creditsUsed, totalCredits, isLoadingBalance, purchaseHistory, isLoadingHistory, creditBatches, isLoadingBatches, creditSummary, isLoadingSummary } = useCreditBundle();
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
                      {creditsAvailable.toLocaleString()}
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
                  {isLoadingBalance ? <Skeleton width={30} sx={{ bgcolor: 'rgba(255,255,255,0.25)', mx: 'auto' }} /> : creditsUsed.toLocaleString()}
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
                  {isLoadingBalance ? <Skeleton width={30} sx={{ bgcolor: 'rgba(255,255,255,0.25)', mx: 'auto' }} /> : totalCredits.toLocaleString()}
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

      {/* Expiring Soon Alert */}
      {!isLoadingSummary && creditSummary && creditSummary.expiringIn7Days > 0 && (
        <Alert
          severity="warning"
          sx={{ mb: 3, borderRadius: 3 }}
          action={
            <Button size="small" onClick={() => router.push('/buy-credits')} sx={{ color: 'warning.main', fontWeight: 700 }}>
              Buy Credits
            </Button>
          }
        >
          <Typography variant="body2" fontWeight={600}>
            ⏳ You have {creditSummary.expiringIn7Days} credits expiring in the next 7 days!
          </Typography>
          <Typography variant="caption">Top up now to automatically roll them over and extend their validity by 30 days.</Typography>
        </Alert>
      )}

      {/* Credit Batches Table */}
      <Card sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Your Credit Batches
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Credits are valid for 30 days from purchase. Top up before expiry to roll them over.
          </Typography>

          <TableContainer sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Purchase Date</StyledTableCell>
                  <StyledTableCell align="center">Credits Purchased</StyledTableCell>
                  <StyledTableCell align="center">Remaining</StyledTableCell>
                  <StyledTableCell align="center">Expiry Date</StyledTableCell>
                  <StyledTableCell align="center">Status</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoadingBatches ? (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Skeleton height={50} />
                    </TableCell>
                  </TableRow>
                ) : creditBatches.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                        No credit batches found. Purchase credits to get started.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  creditBatches.map((batch) => {
                    const daysUntilExpiry = Math.ceil((new Date(batch.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    const isExpiringSoon = daysUntilExpiry <= 7 && daysUntilExpiry > 0;

                    const isTrial = batch.purchaseReference === 'TRIAL';

                    return (
                      <HoverRow key={batch.batchId}>
                        <TableCell>
                          {new Date(batch.purchaseDate).toLocaleDateString()}
                          {isTrial && (
                            <Chip
                              size="small"
                              label="Free Trial"
                              sx={{
                                ml: 1,
                                fontWeight: 800,
                                fontSize: '0.65rem',
                                backgroundColor: '#667eea',
                                color: 'white',
                                borderRadius: 999,
                                px: 0.5,
                                height: 22,
                                '& .MuiChip-label': {
                                  px: 1,
                                },
                              }}
                            />
                          )}
                        </TableCell>
                        <TableCell align="center">{(batch.credits || 0).toLocaleString()}</TableCell>
                        <TableCell align="center">
                          <Typography fontWeight={600} color={(batch.remainingCredits || 0) > 0 ? 'primary' : 'text.secondary'}>
                            {(batch.remainingCredits || 0).toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" color={isExpiringSoon ? 'warning.main' : 'text.primary'} fontWeight={isExpiringSoon ? 600 : 400}>
                            {new Date(batch.expiryDate).toLocaleDateString()}
                            {isExpiringSoon && <Chip size="small" label={`${daysUntilExpiry}d left`} color="warning" sx={{ ml: 1, fontWeight: 700 }} />}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          {batch.status === 'active' ? (
                            <Chip size="small" label="Active" color="success" sx={{ fontWeight: 700 }} />
                          ) : batch.status === 'expired' ? (
                            <Chip size="small" label="Expired" color="error" sx={{ fontWeight: 700 }} />
                          ) : (
                            <Chip size="small" label="Rolled Over" color="info" sx={{ fontWeight: 700 }} />
                          )}
                        </TableCell>
                      </HoverRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Credit Bundles Section */}
      <CreditBundleSection />
    </Box>
  );
};
