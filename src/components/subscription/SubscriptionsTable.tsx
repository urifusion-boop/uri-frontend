import { NumberHelper } from '@/helpers/NumberHelper';
import { TextHelper } from '@/helpers/TextHelper';
import { PaystackSubscriptionDto } from '@/models/dtos/SubscriptionDto';
import { PaystackTransactionStatus } from '@/models/enum-models/PaystackEnum';
import { Box, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, styled } from '@mui/material';
import dayjs from 'dayjs';
import { useState } from 'react';
import { FaRegEye } from 'react-icons/fa6';
import ReceiptModal from '../modals/ReceiptModal';

interface SubscriptionsTableProps {
  transactionHistory: PaystackSubscriptionDto[];
  loading?: boolean;
}

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  fontWeight: 500,
  color: '#000000',
  whiteSpace: 'nowrap',
}));

const tableHeader = ['Plan Name', 'Amount', 'Transaction Date', 'End Date', 'Status', 'Action'];

const SubscriptionsTable = ({ transactionHistory, loading }: SubscriptionsTableProps) => {
  return (
    <TableContainer>
      <Table sx={{ minWidth: 650, border: 'none', mt: '32px' }} aria-label="simple table">
        <TableHead sx={{ backgroundColor: '#FAFAFA' }}>
          <TableRow>
            {tableHeader.map((header) => (
              <TableCell key={header} sx={{ borderBottom: 'none' }}>
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            Array.from(new Array(5)).map((_, index) => (
              <TableRow key={index}>
                {tableHeader.map((_, i) => (
                  <TableCell key={i}>
                    <Skeleton variant="text" animation="wave" width="80%" height={20} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : transactionHistory.length === 0 ? (
            <TableRow>
              <TableCell colSpan={tableHeader.length} align="center">
                <Typography variant="body1" sx={{ py: 4, color: 'gray' }}>
                  No transactions found.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            transactionHistory.map((row) => <SubscriptionItem key={row.id} row={row} />)
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SubscriptionsTable;

interface SubscriptionItemProps {
  row: PaystackSubscriptionDto;
}

const SubscriptionItem = ({ row }: SubscriptionItemProps) => {
  const [openReceipt, setOpenReceipt] = useState(false);
  const statusColor = {
    [PaystackTransactionStatus.SUCCESS]: '#31F63B',
    [PaystackTransactionStatus.ACTIVE]: '#31F63B',
    [PaystackTransactionStatus.FAILED]: '#dc3545',
    [PaystackTransactionStatus.CANCELLED]: '#dc3545',
    [PaystackTransactionStatus.PENDING]: '#ffc107',
    [PaystackTransactionStatus.ABANDONED]: '#6c757d',
    [PaystackTransactionStatus.REVERSED]: '#17a2b8',
  };

  return (
    <>
      <TableRow
        sx={{
          '&:last-child td, &:last-child th': { border: 'none' },
        }}
      >
        <TableCell component="th" scope="row" sx={{ borderBottom: 'none' }}>
          <StyledTypography>{TextHelper.removeChar(row?.plan?.name ?? row?.name, '_')}</StyledTypography>
        </TableCell>
        <TableCell sx={{ borderBottom: 'none' }}>
          <StyledTypography>{NumberHelper.formatNumber(Number(row?.amount ?? 0) / 100)}</StyledTypography>
        </TableCell>
        <TableCell sx={{ borderBottom: 'none' }}>
          <StyledTypography>{dayjs(row.createdAt).format('DD-MMM-YYYY')}</StyledTypography>
        </TableCell>
        <TableCell sx={{ borderBottom: 'none' }}>
          <StyledTypography>{dayjs(row?.most_recent_invoice?.period_end).format('DD-MMM-YYYY')}</StyledTypography>
        </TableCell>
        <TableCell sx={{ borderBottom: 'none' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                width: '9px',
                height: '9px',
                borderRadius: '50%',
                backgroundColor: statusColor[row?.status as PaystackTransactionStatus] ?? '#000000',
                display: 'inline-block',
                marginRight: '8px',
              }}
            />
            <StyledTypography>{row?.status ?? 'Expired'}</StyledTypography>
          </Box>
        </TableCell>
        <TableCell sx={{ borderBottom: 'none' }}>
          <Box sx={{ display: 'flex', gap: '12px' }}>
            {/* <Box
              component={"button"}
              sx={{
                border: "0.93px solid #49494999",
                padding: "6px 5px",
                borderRadius: "3.75px",
              }}
            >
              <BsDownload size={14} color="#434343" />
            </Box> */}
            <Box
              onClick={() => setOpenReceipt(true)}
              component={'button'}
              sx={{
                border: '0.93px solid #49494999',
                padding: '6px 5px',
                borderRadius: '3.75px',
              }}
            >
              <FaRegEye size={14} color="#434343" />
            </Box>
          </Box>
        </TableCell>
      </TableRow>

      <ReceiptModal onClose={() => setOpenReceipt(false)} open={openReceipt} transaction={row} />
    </>
  );
};
