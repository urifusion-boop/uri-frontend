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
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
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
import dayjs from 'dayjs';
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

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              color: 'white',
              background: `linear-gradient(135deg, ${LightThemeColors.uriColor} 0%, ${alpha(LightThemeColors.uriColor, 0.85)} 100%)`,
              boxShadow: '0 16px 45px rgba(0,0,0,0.12)',
              position: 'relative',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: alpha('#fff', 0.08),
              }}
            />
            <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 700 }}>
                    Available Credits
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.85 }}>
                    For lead enrichment & insights
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255,255,255,0.18)',
                    border: '1px solid rgba(255,255,255,0.25)',
                  }}
                >
                  <FaCoins size={22} style={{ opacity: 0.95 }} />
                </Box>
              </Stack>

              {isLoadingBalance ? (
                <Box>
                  <Skeleton variant="text" width="75%" height={58} sx={{ bgcolor: 'rgba(255,255,255,0.25)' }} />
                  <Skeleton variant="text" width="40%" height={22} sx={{ bgcolor: 'rgba(255,255,255,0.18)' }} />
                </Box>
              ) : (
                <Box>
                  <Typography variant="h3" fontWeight={900} sx={{ lineHeight: 1.1 }}>
                    {NumberHelper.formatNumber(creditsAvailable)}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
                    credits available
                  </Typography>
                </Box>
              )}

              <Divider sx={{ my: 2.25, borderColor: 'rgba(255,255,255,0.18)' }} />

              <Grid container spacing={1.5}>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 3,
                      backgroundColor: 'rgba(255,255,255,0.12)',
                      border: '1px solid rgba(255,255,255,0.18)',
                    }}
                  >
                    <Typography variant="caption" sx={{ opacity: 0.85, fontWeight: 700 }}>
                      Credits Used
                    </Typography>
                    <Typography variant="h6" fontWeight={900}>
                      {isLoadingBalance ? <Skeleton width={30} sx={{ bgcolor: 'rgba(255,255,255,0.25)' }} /> : NumberHelper.formatNumber(creditsUsed)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 3,
                      backgroundColor: 'rgba(255,255,255,0.12)',
                      border: '1px solid rgba(255,255,255,0.18)',
                    }}
                  >
                    <Typography variant="caption" sx={{ opacity: 0.85, fontWeight: 700 }}>
                      Total Credits
                    </Typography>
                    <Typography variant="h6" fontWeight={900}>
                      {isLoadingBalance ? <Skeleton width={30} sx={{ bgcolor: 'rgba(255,255,255,0.25)' }} /> : NumberHelper.formatNumber(totalCredits)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 3,
                      backgroundColor: 'rgba(255,255,255,0.12)',
                      border: '1px solid rgba(255,255,255,0.18)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="caption" sx={{ opacity: 0.85, fontWeight: 700 }}>
                      1 credit = ₦140
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.95, fontWeight: 800 }}>
                      Purchase below
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Card sx={{ borderRadius: 4, border: `2px solid ${alpha(LightThemeColors.uriColor, 0.15)}`, boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Stack spacing={1}>
                    <Typography variant="body2" sx={{ color: '#6B6B6B', fontWeight: 600 }}>
                      Wallet Balance
                    </Typography>
                    {isLoadingWallet ? (
                      <Skeleton width={100} height={36} />
                    ) : (
                      <Typography variant="h5" fontWeight={900} color={LightThemeColors.uriColor}>
                        {currency} {NumberHelper.formatNumber(balance)}
                      </Typography>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card sx={{ borderRadius: 4, border: `2px solid ${alpha(LightThemeColors.uriColor, 0.15)}`, boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Stack spacing={1}>
                    <Typography variant="body2" sx={{ color: '#6B6B6B', fontWeight: 600 }}>
                      Purchases
                    </Typography>
                    {isLoadingHistory ? (
                      <Skeleton width={40} height={36} />
                    ) : (
                      <Typography variant="h5" fontWeight={900} color={LightThemeColors.uriColor}>
                        {purchaseHistory.length}
                      </Typography>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 4, background: alpha('#27ae60', 0.04), border: `1px solid ${alpha('#27ae60', 0.15)}` }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 3,
                        background: alpha('#27ae60', 0.12),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#27ae60',
                      }}
                    >
                      <FaCoins size={22} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ color: '#6B6B6B', fontWeight: 600 }}>
                        Need more credits?
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#141414', fontWeight: 800, mt: 0.3 }}>
                        Purchase bundles or create a custom plan below
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Purchase History Table */}
          <Card sx={{ borderRadius: 4, boxShadow: '0 12px 40px rgba(0,0,0,0.06)', mt: 2 }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ px: 3, py: 2.25 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} gap={1}>
                  <Box>
                    <Typography variant="h6" fontWeight={900} sx={{ color: '#141414' }}>
                      Purchase History
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                      Your credit purchase transactions
                    </Typography>
                  </Box>
                  <Chip
                    label={`${purchaseHistory.length} purchases`}
                    variant="outlined"
                    sx={{
                      borderRadius: 999,
                      fontWeight: 800,
                      borderColor: alpha('#CD1B78', 0.35),
                      color: '#8E1354',
                    }}
                  />
                </Stack>
              </Box>
              <Divider />

              <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Date</StyledTableCell>
                      <StyledTableCell>Bundle</StyledTableCell>
                      <StyledTableCell>Credits</StyledTableCell>
                      <StyledTableCell align="right">Amount</StyledTableCell>
                      <StyledTableCell>Status</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {isLoadingHistory ? (
                      Array.from({ length: 4 }).map((_, idx) => (
                        <TableRow key={idx}>
                          <TableCell colSpan={5}>
                            <Skeleton height={28} />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : purchaseHistory.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                          <FaCoins size={48} style={{ color: alpha('#000', 0.15), marginBottom: 16 }} />
                          <Typography fontWeight={800} sx={{ color: '#141414' }}>
                            No credit purchases yet
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#6B6B6B', mt: 0.5 }}>
                            Purchase a credit bundle below to get started
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      purchaseHistory.map((purchase: any) => (
                        <HoverRow key={purchase._id || purchase.reference}>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>
                            {dayjs(purchase.purchaseDate).format('MMM D, YYYY')}
                            <Typography variant="caption" sx={{ color: '#8A8A8A', display: 'block' }}>
                              {dayjs(purchase.purchaseDate).format('h:mm A')}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography fontWeight={800} sx={{ color: '#141414', textTransform: 'capitalize' }}>
                              {purchase.bundleTier} Bundle
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#8A8A8A' }}>
                              {purchase.reference}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                              <FaCoins size={14} style={{ color: LightThemeColors.uriColor }} />
                              <Typography fontWeight={800} sx={{ color: '#141414' }}>
                                {NumberHelper.formatNumber(purchase.credits)}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="right">
                            <Typography fontWeight={900} sx={{ color: '#141414', whiteSpace: 'nowrap' }}>
                              {purchase.currency} {NumberHelper.formatNumber(purchase.amount)}
                            </Typography>
                          </TableCell>
                          <TableCell>{renderStatus(purchase.status)}</TableCell>
                        </HoverRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
