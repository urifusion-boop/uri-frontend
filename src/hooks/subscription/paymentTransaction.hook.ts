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
    const popup = new PaystackPop();

    const transaction = popup.resumeTransaction(transactionDetails?.access_code, {
      onSuccess: (reference: PayStackReference) => {
        // callbacks?.onSuccess?.(reference);
        verifyTransaction.mutate(undefined, {
          onSuccess: () => {
            setPaymentStatus(true);
            setOpenPaymentFeedbackModal(true);
          },
          onError: () => {
            setPaymentStatus(false);
            setOpenPaymentFeedbackModal(true);
          },
        });
      },
      onClose: () => callbacks?.onClose?.(),
      onCancel: () => callbacks?.onClose?.(),
      onError: () => {
        callbacks?.onClose?.();
        setPaymentStatus(false);
        setOpenPaymentFeedbackModal(true);
      },
    });

    console.log(transaction);
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
