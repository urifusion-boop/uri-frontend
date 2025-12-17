import Spinner from '@/components/loaders/Spinner';
import { LightThemeColors } from '@/configs/colors.config';
import { NumberHelper } from '@/helpers/NumberHelper';
import { useWallet } from '@/hooks/wallet/useWallet';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  styled,
} from '@mui/material';
import dayjs from 'dayjs';
import { useState } from 'react';
import { FaPlus, FaTimes, FaWallet } from 'react-icons/fa';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  color: '#666',
}));

const StatusBadge = styled(Box)<{ status: string }>(({ theme, status }) => ({
  padding: '4px 12px',
  borderRadius: '16px',
  fontSize: '12px',
  fontWeight: 600,
  display: 'inline-block',
  backgroundColor: status === 'success' ? '#e6f4ea' : status === 'failed' ? '#fce8e6' : '#fff8e1',
  color: status === 'success' ? '#1e7e34' : status === 'failed' ? '#d93025' : '#f1c40f',
}));

export const WalletPage = () => {
  const { balance, currency, transactions, isLoadingBalance, isLoadingTransactions, fundWallet, isFunding } = useWallet();
  const [openFundModal, setOpenFundModal] = useState(false);
  const [amount, setAmount] = useState('');

  const handleFund = async () => {
    if (!amount || isNaN(Number(amount))) return;
    const numAmount = Number(amount);
    if (numAmount < 5000) return; // Min 5000

    await fundWallet({ amount: numAmount, currency: 'NGN' }); // Default to NGN for now
    setOpenFundModal(false);
    setAmount('');
  };

  if (isLoadingBalance && !balance) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <Spinner color={LightThemeColors.uriColor} />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Grid container spacing={3}>
        {/* Balance Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #CD1B78 0%, #8E1354 100%)', color: 'white', borderRadius: 4 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                  Wallet Balance
                </Typography>
                <FaWallet size={24} style={{ opacity: 0.8 }} />
              </Box>
              <Typography variant="h3" fontWeight="bold" mb={1}>
                {currency} {NumberHelper.formatNumber(balance)}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Available for Lead Gen & Scanning
              </Typography>
              <Box mt={3}>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: 'white',
                    color: '#CD1B78',
                    fontWeight: 'bold',
                    '&:hover': { bgcolor: '#f0f0f0' },
                  }}
                  onClick={() => setOpenFundModal(true)}
                  startIcon={<FaPlus />}
                >
                  Fund Wallet
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Transaction History */}
        <Grid item xs={12} md={8}>
          <Typography variant="h5" fontWeight="bold" mb={2}>
            Transaction History
          </Typography>
          <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Date</StyledTableCell>
                  <StyledTableCell>Description</StyledTableCell>
                  <StyledTableCell>Type</StyledTableCell>
                  <StyledTableCell>Amount</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoadingTransactions ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Spinner color={LightThemeColors.uriColor} />
                    </TableCell>
                  </TableRow>
                ) : transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography color="textSecondary">No transactions yet</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>{dayjs(tx.date).format('MMM D, YYYY h:mm A')}</TableCell>
                      <TableCell>{tx.description}</TableCell>
                      <TableCell sx={{ textTransform: 'capitalize' }}>{tx.type}</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: tx.type === 'credit' ? 'green' : 'red' }}>
                        {tx.type === 'credit' ? '+' : '-'} {tx.currency} {NumberHelper.formatNumber(tx.amount)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={tx.status}>{tx.status}</StatusBadge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      {/* Fund Wallet Modal */}
      <Dialog open={openFundModal} onClose={() => setOpenFundModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            Fund Wallet
            <IconButton onClick={() => setOpenFundModal(false)}>
              <FaTimes />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box py={2}>
            <Typography variant="body2" color="textSecondary" mb={2}>
              Enter the amount you want to add to your wallet. Minimum funding amount is ₦5,000.
            </Typography>
            <TextField
              label="Amount (₦)"
              type="number"
              fullWidth
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              helperText={Number(amount) > 0 && Number(amount) < 5000 ? 'Minimum amount is ₦5,000' : ''}
              error={Number(amount) > 0 && Number(amount) < 5000}
              InputProps={{ inputProps: { min: 5000 } }}
            />
            <Box mt={3} display="flex" justifyContent="flex-end">
              <Button variant="contained" color="primary" onClick={handleFund} disabled={!amount || Number(amount) < 5000 || isFunding}>
                {isFunding ? <Spinner size={20} color="white" /> : 'Proceed to Pay'}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};
