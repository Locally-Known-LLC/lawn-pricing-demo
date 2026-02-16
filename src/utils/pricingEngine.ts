export interface PricingTier {
  min: number;
  max: number;
  price: number;
}

export interface RecurringAdjustment {
  type: 'percentage' | 'fixed';
  value: number;
}

export interface TierValidationError {
  tierIndex: number;
  message: string;
}

export function validateTiers(tiers: PricingTier[]): TierValidationError[] {
  const errors: TierValidationError[] = [];

  tiers.forEach((tier, idx) => {
    if (tier.min >= tier.max) {
      errors.push({
        tierIndex: idx,
        message: `Tier ${idx + 1}: Start must be less than end`,
      });
    }

    if (idx > 0) {
      const prevTier = tiers[idx - 1];
      if (tier.min !== prevTier.max + 1) {
        if (tier.min > prevTier.max + 1) {
          errors.push({
            tierIndex: idx,
            message: `Gap between tier ${idx} and ${idx + 1}`,
          });
        } else if (tier.min <= prevTier.max) {
          errors.push({
            tierIndex: idx,
            message: `Overlap between tier ${idx} and ${idx + 1}`,
          });
        }
      }
    }
  });

  return errors;
}

export function getTierForSqft(sqft: number, tiers: PricingTier[]): PricingTier | null {
  const tier = tiers.find(t => sqft >= t.min && sqft <= t.max);
  return tier || (tiers.length > 0 ? tiers[tiers.length - 1] : null);
}

export interface PricingBreakdown {
  baseRate: number;
  sqftCalculation: number;
  subtotal: number;
  minimumApplied: boolean;
  minimumAmount: number;
  finalPrice: number;
}

export function calculatePrice(
  sqft: number,
  pricingModel: 'tiered' | 'base_per_sqft',
  basePrice: number,
  perSqftRate: number,
  pricingTiers: PricingTier[],
  minimumPrice: number
): PricingBreakdown {
  if (pricingModel === 'base_per_sqft') {
    const sqftCalculation = sqft * perSqftRate;
    const subtotal = basePrice + sqftCalculation;
    const finalPrice = Math.max(subtotal, minimumPrice);

    return {
      baseRate: basePrice,
      sqftCalculation,
      subtotal,
      minimumApplied: finalPrice > subtotal,
      minimumAmount: minimumPrice,
      finalPrice,
    };
  } else {
    const tier = getTierForSqft(sqft, pricingTiers);
    const tierPrice = tier ? tier.price : 0;
    const finalPrice = Math.max(tierPrice, minimumPrice);

    return {
      baseRate: tierPrice,
      sqftCalculation: 0,
      subtotal: tierPrice,
      minimumApplied: finalPrice > tierPrice,
      minimumAmount: minimumPrice,
      finalPrice,
    };
  }
}

export function applyRecurringAdjustment(
  basePrice: number,
  adjustment: RecurringAdjustment | undefined
): number {
  if (!adjustment || adjustment.value === 0) return basePrice;

  if (adjustment.type === 'percentage') {
    return basePrice * (1 - adjustment.value / 100);
  } else {
    return Math.max(0, basePrice - adjustment.value);
  }
}

export interface RecurringPrices {
  weekly?: number;
  biweekly?: number;
  monthly?: number;
}

export function calculateRecurringPrices(
  basePrice: number,
  adjustments: {
    weekly?: RecurringAdjustment;
    biweekly?: RecurringAdjustment;
    monthly?: RecurringAdjustment;
  }
): RecurringPrices {
  return {
    weekly: adjustments.weekly ? applyRecurringAdjustment(basePrice, adjustments.weekly) : undefined,
    biweekly: adjustments.biweekly ? applyRecurringAdjustment(basePrice, adjustments.biweekly) : undefined,
    monthly: adjustments.monthly ? applyRecurringAdjustment(basePrice, adjustments.monthly) : undefined,
  };
}

export function autoAdjustTierStarts(tiers: PricingTier[], changedIndex: number, newMax: number): PricingTier[] {
  const updatedTiers = [...tiers];
  updatedTiers[changedIndex].max = newMax;

  if (changedIndex < updatedTiers.length - 1) {
    updatedTiers[changedIndex + 1].min = newMax + 1;
  }

  return updatedTiers;
}
