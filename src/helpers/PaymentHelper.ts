export class PaymentHelper {
  static formatPaystackAmount(amount: number): number {
    return amount * 100;
  }

  static formatPaystackAmountToDecimal(amount: number): number {
    return amount / 100;
  }
  static addDiscountToPaystackAmount(amount: number, duration: string): number {
    console.log("amount : ", amount, duration);
    switch (duration) {
      case "annually":
        // 28.57% discount
        const annualDiscount = 420000 * 0.2857;
        return amount + annualDiscount;
      case "monthly":
        // 20% discount
        const monthlyDiscount = 35000 * 0.2;
        return amount + monthlyDiscount;
      default:
        return amount;
    }
  }
}
