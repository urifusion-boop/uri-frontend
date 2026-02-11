import { LightThemeColors } from '@/configs/colors.config';
import { NumberHelper } from '@/helpers/NumberHelper';
import { useCreditBundle } from '@/hooks/credits/useCreditBundle';
import { Box, Card, CardContent, Chip, Divider, Paper, Skeleton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, alpha, styled } from '@mui/material';
import dayjs from 'dayjs';
import { FaCoins } from 'react-icons/fa';

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

export default function WalletHistoryPage() {
  const { purchaseHistory, isLoadingHistory } = useCreditBundle();

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
            Purchase History
          </Typography>
          <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
            Your credit purchase transactions
          </Typography>
        </Box>
      </Stack>

      <Card sx={{ borderRadius: 4, boxShadow: '0 12px 40px rgba(0,0,0,0.06)' }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ px: 3, py: 2.25 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} gap={1}>
              <Box>
                <Typography variant="h6" fontWeight={900} sx={{ color: '#141414' }}>
                  All Purchases
                </Typography>
                <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                  Complete history of credit bundle purchases
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
                  Array.from({ length: 6 }).map((_, idx) => (
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
                        Purchase a credit bundle to get started
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  purchaseHistory
                    .filter((purchase: any) => purchase.status?.toLowerCase() === 'success')
                    .map((purchase: any) => (
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
    </Box>
  );
}
