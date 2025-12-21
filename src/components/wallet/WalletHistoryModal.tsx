import Text from '@/components/atoms/CustomText';
import { TextHelper } from '@/helpers/TextHelper';
import useCustomTheme from '@/hooks/theme.hook';
import { WalletTransactionDto } from '@/models/dtos/WalletDto';
import { Box, Chip, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import dayjs from 'dayjs';
import React from 'react';

interface IProps {
  open: boolean;
  onClose: () => void;
  transactions: WalletTransactionDto[];
}

const WalletHistoryModal: React.FC<IProps> = ({ open, onClose, transactions }) => {
  const { themeColors } = useCustomTheme();

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 600, md: 800 },
          bgcolor: 'white',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Text size={20} weight={700} mode="base">
            Transaction History
          </Text>
        </Box>

        {transactions && transactions.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((tx, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Text size={14} weight={400} mode="secondary">
                        {dayjs(tx.transaction_date).format('MMM D, YYYY h:mm A')}
                      </Text>
                    </TableCell>
                    <TableCell>
                      <Text size={14} weight={500}>
                        {tx.narration}
                      </Text>
                      <Text size={12} weight={400} mode="secondary">
                        {tx.reference}
                      </Text>
                    </TableCell>
                    <TableCell>
                      <Chip label={tx.transaction_type} size="small" color={tx.transaction_type === 'income' ? 'success' : 'default'} variant="outlined" />
                    </TableCell>
                    <TableCell align="right">
                      <Text size={14} weight={600} style={{ color: tx.transaction_type === 'income' ? 'green' : 'red' }}>
                        {tx.transaction_type === 'income' ? '+' : '-'}₦{TextHelper.formatNumberWithCommas(tx.amount.toString())}
                      </Text>
                    </TableCell>
                    <TableCell align="right">
                      <Chip label={tx.status} size="small" color={tx.status === 'success' ? 'success' : 'warning'} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box py={4} textAlign="center">
            <Text size={16} weight={400} mode="secondary">
              No transactions found.
            </Text>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default WalletHistoryModal;
