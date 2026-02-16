import { Plus, Trash2 } from 'lucide-react';
import { PricingTier, RecurringAdjustment, validateTiers, autoAdjustTierStarts } from '../../utils/pricingEngine';

interface Props {
  pricingModel: 'tiered' | 'base_per_sqft';
  basePrice: number;
  perSqftRate: number;
  pricingTiers: PricingTier[];
  minimumPrice: number;
  recurringAdjustments: {
    weekly?: RecurringAdjustment;
    biweekly?: RecurringAdjustment;
    monthly?: RecurringAdjustment;
  };
  onPricingModelChange: (model: 'tiered' | 'base_per_sqft') => void;
  onBasePriceChange: (price: number) => void;
  onPerSqftRateChange: (rate: number) => void;
  onPricingTiersChange: (tiers: PricingTier[]) => void;
  onMinimumPriceChange: (price: number) => void;
  onRecurringAdjustmentsChange: (adjustments: {
    weekly?: RecurringAdjustment;
    biweekly?: RecurringAdjustment;
    monthly?: RecurringAdjustment;
  }) => void;
}

export default function ServicePricingStep({
  pricingModel,
  basePrice,
  perSqftRate,
  pricingTiers,
  minimumPrice,
  recurringAdjustments,
  onPricingModelChange,
  onBasePriceChange,
  onPerSqftRateChange,
  onPricingTiersChange,
  onMinimumPriceChange,
  onRecurringAdjustmentsChange,
}: Props) {
  const tierValidationErrors = validateTiers(pricingTiers);

  const handleTierMaxChange = (index: number, newMax: number) => {
    const updatedTiers = autoAdjustTierStarts(pricingTiers, index, newMax);
    onPricingTiersChange(updatedTiers);
  };

  const handleTierPriceChange = (index: number, newPrice: number) => {
    const updatedTiers = [...pricingTiers];
    updatedTiers[index].price = newPrice;
    onPricingTiersChange(updatedTiers);
  };

  const handleAddTier = () => {
    const lastTier = pricingTiers[pricingTiers.length - 1];
    const newTier = {
      min: lastTier ? lastTier.max + 1 : 0,
      max: lastTier ? lastTier.max + 5000 : 5000,
      price: 0,
    };
    onPricingTiersChange([...pricingTiers, newTier]);
  };

  const handleDeleteTier = (index: number) => {
    if (pricingTiers.length <= 1) return;
    const newTiers = pricingTiers.filter((_, i) => i !== index);
    if (index < newTiers.length && index > 0) {
      newTiers[index].min = newTiers[index - 1].max + 1;
    }
    onPricingTiersChange(newTiers);
  };

  const handleRecurringAdjustmentChange = (
    frequency: 'weekly' | 'biweekly' | 'monthly',
    field: 'type' | 'value',
    value: string | number
  ) => {
    const current = recurringAdjustments[frequency];
    onRecurringAdjustmentsChange({
      ...recurringAdjustments,
      [frequency]: {
        type: field === 'type' ? (value as 'percentage' | 'fixed') : (current?.type || 'percentage'),
        value: field === 'value' ? (typeof value === 'number' ? value : parseFloat(value) || 0) : (current?.value || 0),
      },
    });
  };

  const isTierInvalid = (index: number) => {
    return tierValidationErrors.some(
      error =>
        error.tierIndex === index ||
        error.message.includes(`tier ${index}`) ||
        error.message.includes(`tier ${index + 1}`) ||
        error.message.includes(`Tier ${index + 1}`)
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Pricing Configuration</h2>
        <p className="text-gray-600">Set pricing rules based on property size</p>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-3">Pricing Model</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="pricingModel"
              value="tiered"
              checked={pricingModel === 'tiered'}
              onChange={(e) => onPricingModelChange(e.target.value as 'tiered' | 'base_per_sqft')}
              className="w-4 h-4 text-green-600"
            />
            <span className="text-sm text-gray-700">Tiered</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="pricingModel"
              value="base_per_sqft"
              checked={pricingModel === 'base_per_sqft'}
              onChange={(e) => onPricingModelChange(e.target.value as 'tiered' | 'base_per_sqft')}
              className="w-4 h-4 text-green-600"
            />
            <span className="text-sm text-gray-700">Base + Per SqFt</span>
          </label>
        </div>
      </div>

      {pricingModel === 'base_per_sqft' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base Price ($)
              </label>
              <input
                type="number"
                value={basePrice}
                onChange={(e) => onBasePriceChange(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="35"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Per SqFt Rate ($)
              </label>
              <input
                type="number"
                step="0.001"
                value={perSqftRate}
                onChange={(e) => onPerSqftRateChange(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="0.008"
              />
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              Example: For a 6,000 sqft property: ${basePrice} + (6,000 × ${perSqftRate}) = ${(basePrice + (6000 * perSqftRate)).toFixed(2)}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Square Footage Tiers
              </label>
            </div>
            <p className="text-xs text-gray-500 mb-3">Ranges must cover all square footage without gaps or overlap.</p>

            {tierValidationErrors.length > 0 && (
              <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                {tierValidationErrors.map((error, idx) => (
                  <p key={idx} className="text-xs text-red-700">{error.message}</p>
                ))}
              </div>
            )}

            {pricingTiers.map((tier, idx) => (
              <div
                key={idx}
                className={`p-4 bg-gray-50 rounded-lg border mb-3 ${
                  isTierInvalid(idx) ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Min SqFt
                    </label>
                    <input
                      type="number"
                      value={tier.min}
                      disabled={idx === 0}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Max SqFt
                    </label>
                    <input
                      type="number"
                      value={tier.max}
                      onChange={(e) => handleTierMaxChange(idx, parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Price ($)
                      </label>
                      <input
                        type="number"
                        value={tier.price}
                        onChange={(e) => handleTierPriceChange(idx, parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                      />
                    </div>
                    {pricingTiers.length > 1 && (
                      <button
                        onClick={() => handleDeleteTier(idx)}
                        className="mt-auto px-2 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete tier"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={handleAddTier}
              className="w-full px-4 py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-green-400 hover:text-green-600 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Tier
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4 pt-4 border-t border-gray-200">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Price Floor ($)
          </label>
          <input
            type="number"
            value={minimumPrice}
            onChange={(e) => onMinimumPriceChange(parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="50"
          />
          <p className="text-sm text-gray-500 mt-2">Protects small properties from underpricing</p>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Recurring Frequency Adjustments
        </label>

        {['weekly', 'biweekly', 'monthly'].map((freq) => (
          <div key={freq} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center">
                <p className="font-medium text-gray-900 capitalize">
                  {freq === 'biweekly' ? 'Bi-weekly' : freq}
                </p>
              </div>
              <div>
                <select
                  value={recurringAdjustments[freq as keyof typeof recurringAdjustments]?.type || 'percentage'}
                  onChange={(e) => handleRecurringAdjustmentChange(freq as 'weekly' | 'biweekly' | 'monthly', 'type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>
              <div>
                <input
                  type="number"
                  value={recurringAdjustments[freq as keyof typeof recurringAdjustments]?.value || 0}
                  onChange={(e) => handleRecurringAdjustmentChange(freq as 'weekly' | 'biweekly' | 'monthly', 'value', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  placeholder={recurringAdjustments[freq as keyof typeof recurringAdjustments]?.type === 'percentage' ? '5' : '10'}
                />
              </div>
            </div>
          </div>
        ))}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            Apply discounts or adjustments for recurring service frequencies
          </p>
        </div>
      </div>
    </div>
  );
}
