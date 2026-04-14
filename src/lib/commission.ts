/**
 * Platform fee calculator for Mi Tierra marketplace.
 * Default commission rate is 5% of the product subtotal.
 */

export interface CommissionBreakdown {
  fee: number;
  sellerNet: number;
  total: number;
}

/**
 * Calculates the platform fee, seller net payout, and buyer-facing total.
 * The fee is deducted from the seller's payout — the buyer pays only `subtotal`.
 */
export function calcPlatformFee(
  subtotal: number,
  rate = 0.05,
): CommissionBreakdown {
  const fee = parseFloat((subtotal * rate).toFixed(2));
  const sellerNet = parseFloat((subtotal - fee).toFixed(2));
  return { fee, sellerNet, total: subtotal };
}
