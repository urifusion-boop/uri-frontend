import Spinner from '@/components/loaders/Spinner';
import { LightThemeColors } from '@/configs/colors.config';
import { NumberHelper } from '@/helpers/NumberHelper';
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
import { FaPlus, FaTimes, FaWallet } from 'react-icons/fa';
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

const MIN_FUNDING_AMOUNT = 500;

export const WalletPage = () => {
  const { balance, currency, transactions, isLoadingWallet, isWalletError, fundWallet, isFunding } = useWallet();
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
            Wallet
          </Typography>
          <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
            Fund your wallet and track payments for Lead Gen & scanning.
          </Typography>
        </Box>
        <Button
          onClick={() => setOpenFundModal(true)}
          startIcon={<FaPlus />}
          variant="contained"
          sx={{
            borderRadius: 999,
            px: 2.5,
            py: 1.2,
            fontWeight: 800,
            backgroundColor: LightThemeColors.uriColor,
            boxShadow: '0 10px 30px rgba(0,0,0,0.10)',
            '&:hover': {
              backgroundColor: '#B8186A',
              boxShadow: '0 12px 35px rgba(0,0,0,0.12)',
            },
          }}
          disabled={isFunding}
        >
          Fund wallet
        </Button>
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
              backgroundColor: LightThemeColors.uriColor,
              boxShadow: '0 16px 45px rgba(0,0,0,0.12)',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 700 }}>
                    Wallet balance
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.85 }}>
                    Available for Lead Gen & scanning
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: 999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255,255,255,0.16)',
                    border: '1px solid rgba(255,255,255,0.22)',
                  }}
                >
                  <FaWallet size={18} style={{ opacity: 0.95 }} />
                </Box>
              </Stack>

              {isLoadingWallet ? (
                <Box>
                  <Skeleton variant="text" width="75%" height={58} sx={{ bgcolor: 'rgba(255,255,255,0.25)' }} />
                  <Skeleton variant="text" width="40%" height={22} sx={{ bgcolor: 'rgba(255,255,255,0.18)' }} />
                </Box>
              ) : (
                <Box>
                  <Typography variant="h3" fontWeight={900} sx={{ lineHeight: 1.1 }}>
                    {currency} {NumberHelper.formatNumber(balance)}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
                    Min funding: ₦{NumberHelper.formatNumber(MIN_FUNDING_AMOUNT)}
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
                      Credits
                    </Typography>
                    <Typography variant="h6" fontWeight={900}>
                      {isLoadingWallet ? <Skeleton width={30} sx={{ bgcolor: 'rgba(255,255,255,0.25)' }} /> : creditCount}
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
                      Debits
                    </Typography>
                    <Typography variant="h6" fontWeight={900}>
                      {isLoadingWallet ? <Skeleton width={30} sx={{ bgcolor: 'rgba(255,255,255,0.25)' }} /> : debitCount}
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
                      Last activity
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.95, fontWeight: 800 }}>
                      {isLoadingWallet ? <Skeleton width={110} sx={{ bgcolor: 'rgba(255,255,255,0.25)' }} /> : lastActivity ? dayjs(lastActivity).format('MMM D, YYYY') : '—'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 4, boxShadow: '0 12px 40px rgba(0,0,0,0.06)' }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ px: 3, py: 2.25 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} gap={1}>
                  <Box>
                    <Typography variant="h6" fontWeight={900} sx={{ color: '#141414' }}>
                      Transaction history
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                      Latest credits and debits from your wallet.
                    </Typography>
                  </Box>
                  <Chip
                    label={`${transactions.length} total`}
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
                      <StyledTableCell>Description</StyledTableCell>
                      <StyledTableCell>Type</StyledTableCell>
                      <StyledTableCell align="right">Amount</StyledTableCell>
                      <StyledTableCell>Status</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {isLoadingWallet ? (
                      Array.from({ length: 6 }).map((_, idx) => (
                        <TableRow key={idx}>
                          <TableCell colSpan={5}>
                            <Skeleton height={28} />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : sortedTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                          <Typography fontWeight={800} sx={{ color: '#141414' }}>
                            No transactions yet
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#6B6B6B', mt: 0.5 }}>
                            Fund your wallet to see payments appear here.
                          </Typography>
                          <Box mt={2}>
                            <Button
                              onClick={() => setOpenFundModal(true)}
                              variant="contained"
                              sx={{
                                borderRadius: 999,
                                px: 2.5,
                                fontWeight: 900,
                                backgroundColor: LightThemeColors.uriColor,
                                boxShadow: '0 10px 30px rgba(0,0,0,0.10)',
                                '&:hover': { backgroundColor: '#B8186A', boxShadow: '0 12px 35px rgba(0,0,0,0.12)' },
                              }}
                            >
                              Fund wallet
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      sortedTransactions.map((tx) => (
                        <HoverRow key={tx.id}>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>
                            {dayjs(tx.date).format('MMM D, YYYY')}
                            <Typography variant="caption" sx={{ color: '#8A8A8A', display: 'block' }}>
                              {dayjs(tx.date).format('h:mm A')}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ maxWidth: 340 }}>
                            <Typography fontWeight={800} sx={{ color: '#141414' }} noWrap>
                              {tx.description}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#8A8A8A' }} noWrap>
                              {tx.reference}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ textTransform: 'capitalize' }}>
                            <Chip
                              size="small"
                              label={tx.type}
                              variant="outlined"
                              sx={{
                                borderRadius: 999,
                                fontWeight: 800,
                                borderColor: tx.type === 'credit' ? alpha('#1e7e34', 0.35) : alpha('#d93025', 0.35),
                                color: tx.type === 'credit' ? '#1e7e34' : '#d93025',
                                backgroundColor: tx.type === 'credit' ? alpha('#1e7e34', 0.06) : alpha('#d93025', 0.06),
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Typography
                              fontWeight={900}
                              sx={{
                                color: tx.type === 'credit' ? '#1e7e34' : '#d93025',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {tx.type === 'credit' ? '+' : '-'} {tx.currency} {NumberHelper.formatNumber(tx.amount)}
                            </Typography>
                          </TableCell>
                          <TableCell>{renderStatus(tx.status)}</TableCell>
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
