import { NumberHelper } from '@/helpers/NumberHelper';
import { PDFHelper } from '@/helpers/PDFHelper';
import { TextHelper } from '@/helpers/TextHelper';
import { PaystackSubscriptionDto } from '@/models/dtos/SubscriptionDto';
import DownloadIcon from '@mui/icons-material/Download';
import { Box, Button, Divider, Modal, Typography } from '@mui/material';
import dayjs from 'dayjs';
import React, { useRef } from 'react';
import { triggerToast } from '../atoms/CustomToast';
import { UriLogo } from '../atoms/Icons';

interface ReceiptModalProps {
  open: boolean;
  onClose: () => void;
  transaction: PaystackSubscriptionDto;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ open, onClose, transaction }) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!receiptRef.current) return;

    try {
      await PDFHelper.downloadElementAsPDF({
        element: receiptRef.current,
        fileName: `URI_Receipt_${transaction?.subscription_code || 'transaction'}.pdf`,
      });
    } catch {
      triggerToast('error', 'Failed to download receipt. Please try again.');
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 379 },
          maxWidth: '100%',
          bgcolor: '#fff',
          maxHeight: '95dvh',
          overflowY: 'auto',
          borderRadius: '8px',
        }}
        className="payment-receipt-container"
      >
        <Box ref={receiptRef} sx={{ py: '21px', px: 2, minHeight: 400, mt: '20px' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <UriLogo removeLink />
            <Typography
              sx={{
                color: '#333',
                fontWeight: 500,
                fontSize: '13px',
              }}
            >
              Transaction Receipt
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              my: '18px',
            }}
          >
            <Typography
              sx={{
                color: '#308242',
                fontWeight: 700,
                fontSize: '24px',
              }}
            >
              {NumberHelper.formatNumber(Number(transaction?.amount ?? 0) / 100)}
            </Typography>
            <Typography
              sx={{
                color: '#1D1D1D',
                fontWeight: 500,
                fontSize: '15px',
              }}
            >
              {TextHelper.capitalize(transaction?.status)}
            </Typography>
            <Typography
              sx={{
                color: '#1D1D1D',
                fontWeight: 500,
                fontSize: '10px',
              }}
            >
              {dayjs(transaction?.createdAt).format('MMM DD, YYYY h:mm:ss')}
            </Typography>
          </Box>
          <Divider />
          <Box
            sx={{
              p: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography
                sx={{
                  color: '#6B6B6B',
                  fontWeight: 600,
                  fontSize: '12px',
                }}
              >
                Transaction ID
              </Typography>
              <Typography
                sx={{
                  color: '#1D1D1D',
                  fontWeight: 600,
                  fontSize: '12px',
                  textAlign: 'right',
                  maxWidth: '150px',
                }}
              >
                {transaction?.subscription_code}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography
                sx={{
                  color: '#6B6B6B',
                  fontWeight: 600,
                  fontSize: '12px',
                }}
              >
                Billed To
              </Typography>
              <Typography
                sx={{
                  color: '#1D1D1D',
                  fontWeight: 600,
                  fontSize: '12px',
                  maxWidth: '150px',
                }}
              >
                {transaction?.customer?.email ?? ''}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography
                sx={{
                  color: '#6B6B6B',
                  fontWeight: 600,
                  fontSize: '12px',
                }}
              >
                Description
              </Typography>
              <Typography
                sx={{
                  color: '#1D1D1D',
                  fontWeight: 600,
                  fontSize: '12px',
                  maxWidth: '150px',
                  textAlign: 'right',
                }}
              >
                {transaction?.plan?.description}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography
                sx={{
                  color: '#6B6B6B',
                  fontWeight: 600,
                  fontSize: '12px',
                }}
              >
                Billing Cycle
              </Typography>
              <Typography
                sx={{
                  color: '#1D1D1D',
                  fontWeight: 600,
                  fontSize: '12px',
                }}
              >
                {transaction?.plan?.interval}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography
                sx={{
                  color: '#6B6B6B',
                  fontWeight: 600,
                  fontSize: '12px',
                }}
              >
                Discount Applied
              </Typography>
              <Typography
                sx={{
                  color: '#1D1D1D',
                  fontWeight: 600,
                  fontSize: '12px',
                }}
              >
                -
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography
                sx={{
                  color: '#6B6B6B',
                  fontWeight: 600,
                  fontSize: '12px',
                }}
              >
                Payment Method
              </Typography>
              <Typography
                sx={{
                  color: '#1D1D1D',
                  fontWeight: 600,
                  fontSize: '12px',
                }}
              >
                Paystack
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography
                sx={{
                  color: '#6B6B6B',
                  fontWeight: 600,
                  fontSize: '12px',
                }}
              >
                Next Billing Date
              </Typography>
              <Typography
                sx={{
                  color: '#1D1D1D',
                  fontWeight: 600,
                  fontSize: '12px',
                }}
              >
                {dayjs(transaction?.next_payment_date).format('MMM DD, YYYY')}
              </Typography>
            </Box>
          </Box>
          <Divider />
          <Box
            sx={{
              mt: '16px',
              pb: '26px',
              mb: '26px',
            }}
          >
            <Typography
              sx={{
                color: '#000000',
                fontSize: '8px',
                textAlign: 'center',
              }}
            >
              For any issues, contact our support team at{' '}
              <a href="mailto:hello@uricreative.com">
                <span style={{ color: '#CD1B78' }}>hello@uricreative.com</span>
              </a>
            </Typography>
            <Typography
              sx={{
                color: '#000000',
                fontWeight: 400,
                fontSize: '8px',
                textAlign: 'center',
              }}
            >
              © 2025 Uri. All rights reserved.
            </Typography>
          </Box>
        </Box>

        {/* Download Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadPDF}
            sx={{
              bgcolor: '#CD1B78',
              color: 'white',
              '&:hover': {
                bgcolor: '#B01668',
              },
              px: 3,
              borderRadius: '4px',
              textTransform: 'none',
              fontWeight: 500,
            }}
          >
            Download Receipt
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ReceiptModal;
