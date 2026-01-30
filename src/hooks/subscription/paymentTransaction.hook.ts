import { TransactionService } from '@/api/TransactionService';
import { SubscriptionResponseDto } from '@/models/dtos/SubscriptionDto';
import { PaystackTransactionStatus } from '@/models/enum-models/PaystackEnum';
import { useMutation } from '@tanstack/react-query';

type PaymentCallbacks = {
  onSuccess?: (reference: any) => void;
  onClose?: () => void;
};

type PayStackReference = {
  reference: string;
  trans: string;
  status: string;
  message: string;
  transaction: string;
  trxref: string;
  redirecturl: string;
  setOpenPaymentFeedbackModal: (open: boolean) => void;
};

export const usePaymentTransaction = (
  transactionDetails: SubscriptionResponseDto | null,
  setPaymentStatus: (status: boolean) => void,
  setOpenPaymentFeedbackModal: (open: boolean) => void,
  callbacks?: PaymentCallbacks
) => {
  const PaystackPop = require('@paystack/inline-js').default;

  const handlePayStackPayment = () => {
    // Squad flow: redirect to authorization_url
    if (transactionDetails?.authorization_url) {
      window.location.href = transactionDetails.authorization_url;
    } else {
      console.error('No authorization URL found in transaction details');
      setPaymentStatus(false);
      setOpenPaymentFeedbackModal(true);
    }
  };

  const verifyTransaction = useMutation({
    mutationFn: async () => {
      const reference = transactionDetails?.reference;
      if (!reference) throw new Error('Missing transaction reference');

      const response = await TransactionService.verifySubscription(reference);

      if (!response.status) throw new Error(response.responseMessage);

      const status = response.responseData?.status;

      if (status === PaystackTransactionStatus.SUCCESS) {
        return response.responseData;
      }

      if (status === PaystackTransactionStatus.ABANDONED) {
        verifyTransaction.mutate();
        return null;
      }

      throw new Error(response.responseMessage);
    },
  });

  return {
    handlePayStackPayment,
    verifyTransaction,
  };
};
