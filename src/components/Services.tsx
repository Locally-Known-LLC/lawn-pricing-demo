import { ChevronRight, Save, Upload, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

type Step = 1 | 2 | 3 | 4 | 5;

interface PricingTier {
  min: number;
  max: number;
  price: number;
}

interface RecurringAdjustment {
  type: 'percentage' | 'fixed';
  value: number;
}

interface Addon {
  name: string;
  priceType: 'flat' | 'per_sqft' | 'conditional';
  price: number;
  minSqft?: number;
}

interface ServiceData {
  name: string;
  description: string;
  plans: Array<{ name: string; price: number; frequency: string }>;
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
  addons: Addon[];
  depositEnabled: boolean;
  depositAmount: number;
  status: 'draft' | 'live';
}

export default function Services() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [serviceData, setServiceData] = useState<ServiceData>({
    name: 'Lawn Mowing Service',
    description: 'Professional lawn care for your property',
    plans: [
      { name: 'Basic', price: 45, frequency: 'Weekly' },
      { name: 'Standard', price: 55, frequency: 'Weekly' },
      { name: 'Premium', price: 75, frequency: 'Weekly' },
    ],
    pricingModel: 'tiered',
    basePrice: 35,
    perSqftRate: 0.008,
    pricingTiers: [
      { min: 0, max: 5000, price: 45 },
      { min: 5001, max: 8000, price: 60 },
      { min: 8001, max: 12000, price: 85 },
    ],
    minimumPrice: 50,
    recurringAdjustments: {
      weekly: { type: 'percentage', value: 0 },
      biweekly: { type: 'percentage', value: 5 },
      monthly: { type: 'percentage', value: 10 },
    },
    addons: [
      { name: 'Edge Trimming', price: 15, priceType: 'flat' },
      { name: 'Leaf Removal', price: 25, priceType: 'flat' },
    ],
    depositEnabled: true,
    depositAmount: 50,
    status: 'live',
  });

  const validateTiers = () => {
    const errors: string[] = [];
    serviceData.pricingTiers.forEach((tier, idx) => {
      if (tier.min >= tier.max) {
        errors.push(`Tier ${idx + 1}: Start must be less than end`);
      }
      if (idx > 0) {
        const prevTier = serviceData.pricingTiers[idx - 1];
        if (tier.min !== prevTier.max + 1) {
          if (tier.min > prevTier.max + 1) {
            errors.push(`Gap between tier ${idx} and ${idx + 1}`);
          } else if (tier.min <= prevTier.max) {
            errors.push(`Overlap between tier ${idx} and ${idx + 1}`);
          }
        }
      }
    });
    return errors;
  };

  const calculatePreviewPrice = (sqft: number) => {
    if (serviceData.pricingModel === 'base_per_sqft') {
      const calculated = serviceData.basePrice + (sqft * serviceData.perSqftRate);
      return Math.max(calculated, serviceData.minimumPrice);
    } else {
      const tier = serviceData.pricingTiers.find(t => sqft >= t.min && sqft <= t.max);
      const calculated = tier ? tier.price : serviceData.pricingTiers[serviceData.pricingTiers.length - 1]?.price || 0;
      return Math.max(calculated, serviceData.minimumPrice);
    }
  };

  const getRecurringPrice = (basePrice: number, frequency: 'weekly' | 'biweekly' | 'monthly') => {
    const adjustment = serviceData.recurringAdjustments[frequency];
    if (!adjustment || adjustment.value === 0) return basePrice;

    if (adjustment.type === 'percentage') {
      return basePrice * (1 - adjustment.value / 100);
    } else {
      return basePrice - adjustment.value;
    }
  };

  const tierValidationErrors = validateTiers();

  const steps = [
    { number: 1, title: 'Basics', subtitle: 'Service details' },
    { number: 2, title: 'Plans', subtitle: 'Pricing tiers' },
    { number: 3, title: 'Pricing', subtitle: 'Configure rates' },
    { number: 4, title: 'Add-ons', subtitle: 'Extra services' },
    { number: 5, title: 'Deposit', subtitle: 'Payment terms' },
  ];

  const handlePublish = () => {
    setShowPublishModal(false);
    setServiceData({ ...serviceData, status: 'live' });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4 md:space-y-6">
            <div>
              <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2">Service Basics</h2>
              <p className="text-sm md:text-base text-gray-600">Set up your service name and description</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Name
              </label>
              <input
                type="text"
                value={serviceData.name}
                onChange={(e) => setServiceData({ ...serviceData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={serviceData.description}
                onChange={(e) => setServiceData({ ...serviceData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-2">This will appear on your customer-facing quote page</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Upload a service image</p>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Plans</h2>
              <p className="text-gray-600">Create different pricing tiers for your customers</p>
            </div>

            <div className="space-y-4">
              {serviceData.plans.map((plan, idx) => (
                <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Plan Name
                      </label>
                      <input
                        type="text"
                        value={plan.name}
                        onChange={(e) => {
                          const newPlans = [...serviceData.plans];
                          newPlans[idx].name = e.target.value;
                          setServiceData({ ...serviceData, plans: newPlans });
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Base Price
                      </label>
                      <input
                        type="number"
                        value={plan.price}
                        onChange={(e) => {
                          const newPlans = [...serviceData.plans];
                          newPlans[idx].price = parseInt(e.target.value);
                          setServiceData({ ...serviceData, plans: newPlans });
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Frequency
                      </label>
                      <select
                        value={plan.frequency}
                        onChange={(e) => {
                          const newPlans = [...serviceData.plans];
                          newPlans[idx].frequency = e.target.value;
                          setServiceData({ ...serviceData, plans: newPlans });
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option>Weekly</option>
                        <option>Bi-weekly</option>
                        <option>Monthly</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full px-4 py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-green-400 hover:text-green-600 transition-colors font-medium">
              + Add Another Plan
            </button>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                Plans will be automatically adjusted based on property size using your pricing engine
              </p>
            </div>
          </div>
        );

      case 3:
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
                    checked={serviceData.pricingModel === 'tiered'}
                    onChange={(e) => setServiceData({ ...serviceData, pricingModel: e.target.value as 'tiered' | 'base_per_sqft' })}
                    className="w-4 h-4 text-green-600"
                  />
                  <span className="text-sm text-gray-700">Tiered</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="pricingModel"
                    value="base_per_sqft"
                    checked={serviceData.pricingModel === 'base_per_sqft'}
                    onChange={(e) => setServiceData({ ...serviceData, pricingModel: e.target.value as 'tiered' | 'base_per_sqft' })}
                    className="w-4 h-4 text-green-600"
                  />
                  <span className="text-sm text-gray-700">Base + Per SqFt</span>
                </label>
              </div>
            </div>

            {serviceData.pricingModel === 'base_per_sqft' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Base Price ($)
                    </label>
                    <input
                      type="number"
                      value={serviceData.basePrice}
                      onChange={(e) => setServiceData({ ...serviceData, basePrice: parseFloat(e.target.value) || 0 })}
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
                      value={serviceData.perSqftRate}
                      onChange={(e) => setServiceData({ ...serviceData, perSqftRate: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="0.008"
                    />
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    Example: For a 6,000 sqft property: ${serviceData.basePrice} + (6,000 × ${serviceData.perSqftRate}) = ${(serviceData.basePrice + (6000 * serviceData.perSqftRate)).toFixed(2)}
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
                        <p key={idx} className="text-xs text-red-700">{error}</p>
                      ))}
                    </div>
                  )}

                  {serviceData.pricingTiers.map((tier, idx) => (
                    <div key={idx} className={`p-4 bg-gray-50 rounded-lg border mb-3 ${
                      tierValidationErrors.some(e => e.includes(`Tier ${idx + 1}`) || e.includes(`tier ${idx}`) || e.includes(`tier ${idx + 1}`))
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-200'
                    }`}>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Min SqFt
                          </label>
                          <input
                            type="number"
                            value={tier.min}
                            onChange={(e) => {
                              const newTiers = [...serviceData.pricingTiers];
                              newTiers[idx].min = parseInt(e.target.value) || 0;
                              setServiceData({ ...serviceData, pricingTiers: newTiers });
                            }}
                            disabled={idx === 0}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Max SqFt
                          </label>
                          <input
                            type="number"
                            value={tier.max}
                            onChange={(e) => {
                              const newTiers = [...serviceData.pricingTiers];
                              const newMax = parseInt(e.target.value) || 0;
                              newTiers[idx].max = newMax;

                              if (idx < newTiers.length - 1) {
                                newTiers[idx + 1].min = newMax + 1;
                              }

                              setServiceData({ ...serviceData, pricingTiers: newTiers });
                            }}
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
                              onChange={(e) => {
                                const newTiers = [...serviceData.pricingTiers];
                                newTiers[idx].price = parseFloat(e.target.value) || 0;
                                setServiceData({ ...serviceData, pricingTiers: newTiers });
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                            />
                          </div>
                          {serviceData.pricingTiers.length > 1 && (
                            <button
                              onClick={() => {
                                const newTiers = serviceData.pricingTiers.filter((_, i) => i !== idx);
                                if (idx < newTiers.length && idx > 0) {
                                  newTiers[idx].min = newTiers[idx - 1].max + 1;
                                }
                                setServiceData({ ...serviceData, pricingTiers: newTiers });
                              }}
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
                    onClick={() => {
                      const lastTier = serviceData.pricingTiers[serviceData.pricingTiers.length - 1];
                      const newTier = { min: lastTier ? lastTier.max + 1 : 0, max: lastTier ? lastTier.max + 5000 : 5000, price: 0 };
                      setServiceData({ ...serviceData, pricingTiers: [...serviceData.pricingTiers, newTier] });
                    }}
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
                  value={serviceData.minimumPrice}
                  onChange={(e) => setServiceData({ ...serviceData, minimumPrice: parseFloat(e.target.value) || 0 })}
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
                      <p className="font-medium text-gray-900 capitalize">{freq === 'biweekly' ? 'Bi-weekly' : freq}</p>
                    </div>
                    <div>
                      <select
                        value={serviceData.recurringAdjustments[freq as keyof typeof serviceData.recurringAdjustments]?.type || 'percentage'}
                        onChange={(e) => {
                          const current = serviceData.recurringAdjustments[freq as keyof typeof serviceData.recurringAdjustments];
                          setServiceData({
                            ...serviceData,
                            recurringAdjustments: {
                              ...serviceData.recurringAdjustments,
                              [freq]: { type: e.target.value as 'percentage' | 'fixed', value: current?.value || 0 }
                            }
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                      >
                        <option value="percentage">Percentage</option>
                        <option value="fixed">Fixed Amount</option>
                      </select>
                    </div>
                    <div>
                      <input
                        type="number"
                        value={serviceData.recurringAdjustments[freq as keyof typeof serviceData.recurringAdjustments]?.value || 0}
                        onChange={(e) => {
                          const current = serviceData.recurringAdjustments[freq as keyof typeof serviceData.recurringAdjustments];
                          setServiceData({
                            ...serviceData,
                            recurringAdjustments: {
                              ...serviceData.recurringAdjustments,
                              [freq]: { type: current?.type || 'percentage', value: parseFloat(e.target.value) || 0 }
                            }
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                        placeholder={serviceData.recurringAdjustments[freq as keyof typeof serviceData.recurringAdjustments]?.type === 'percentage' ? '5' : '10'}
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

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Add-on Services</h2>
              <p className="text-gray-600">Optional extras customers can add to their quote</p>
            </div>

            <div className="space-y-4">
              {serviceData.addons.map((addon, idx) => (
                <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Add-on Name
                        </label>
                        <input
                          type="text"
                          value={addon.name}
                          onChange={(e) => {
                            const newAddons = [...serviceData.addons];
                            newAddons[idx].name = e.target.value;
                            setServiceData({ ...serviceData, addons: newAddons });
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price Type
                        </label>
                        <select
                          value={addon.priceType}
                          onChange={(e) => {
                            const newAddons = [...serviceData.addons];
                            newAddons[idx].priceType = e.target.value as 'flat' | 'per_sqft' | 'conditional';
                            setServiceData({ ...serviceData, addons: newAddons });
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="flat">Flat Price</option>
                          <option value="per_sqft">Per SqFt</option>
                          <option value="conditional">Conditional</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {addon.priceType === 'per_sqft' ? 'Price per SqFt ($)' : 'Price ($)'}
                        </label>
                        <input
                          type="number"
                          step={addon.priceType === 'per_sqft' ? '0.001' : '1'}
                          value={addon.price}
                          onChange={(e) => {
                            const newAddons = [...serviceData.addons];
                            newAddons[idx].price = parseFloat(e.target.value) || 0;
                            setServiceData({ ...serviceData, addons: newAddons });
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>

                      {addon.priceType === 'conditional' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Min SqFt Required
                          </label>
                          <input
                            type="number"
                            value={addon.minSqft || ''}
                            onChange={(e) => {
                              const newAddons = [...serviceData.addons];
                              newAddons[idx].minSqft = parseInt(e.target.value) || 0;
                              setServiceData({ ...serviceData, addons: newAddons });
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="5000"
                          />
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        const newAddons = serviceData.addons.filter((_, i) => i !== idx);
                        setServiceData({ ...serviceData, addons: newAddons });
                      }}
                      className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove Add-on
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setServiceData({
                  ...serviceData,
                  addons: [...serviceData.addons, { name: '', price: 0, priceType: 'flat' }]
                });
              }}
              className="w-full px-4 py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-green-400 hover:text-green-600 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Another Add-on
            </button>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Deposit & Publishing</h2>
              <p className="text-gray-600">Configure payment terms and publish your service</p>
            </div>

            <div>
              <label className="flex items-center gap-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={serviceData.depositEnabled}
                  onChange={(e) => setServiceData({ ...serviceData, depositEnabled: e.target.checked })}
                  className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                />
                <div>
                  <p className="font-medium text-gray-900">Require Deposit</p>
                  <p className="text-sm text-gray-500">Customers must pay a deposit to accept the quote</p>
                </div>
              </label>
            </div>

            {serviceData.depositEnabled && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deposit Amount
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    value={serviceData.depositAmount}
                    onChange={(e) => setServiceData({ ...serviceData, depositAmount: parseInt(e.target.value) })}
                    className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <span className="text-gray-600">or</span>
                  <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    <option>Fixed amount</option>
                    <option>Percentage</option>
                  </select>
                </div>
              </div>
            )}

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-900 mb-1">Ready to Publish</p>
                  <p className="text-sm text-green-700">
                    Your service is configured and ready to go live. Customers will be able to get instant quotes using your pricing engine.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 md:gap-3 mb-2">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">Service Configuration</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              serviceData.status === 'live' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {serviceData.status === 'live' ? 'Live' : 'Draft'}
            </span>
          </div>
          <p className="text-sm md:text-base text-gray-600">Configure your service details and pricing</p>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <button className="flex-1 sm:flex-none px-3 md:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2 text-sm md:text-base">
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">Save Draft</span>
            <span className="sm:hidden">Save</span>
          </button>
          <button
            onClick={() => setShowPublishModal(true)}
            className="flex-1 sm:flex-none px-3 md:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm md:text-base"
          >
            Publish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 overflow-x-auto">
            <div className="flex items-center gap-2">
              {steps.map((step, idx) => (
                <div key={step.number} className="flex items-center flex-1">
                  <button
                    onClick={() => setCurrentStep(step.number as Step)}
                    className={`flex-1 px-2 md:px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors ${
                      currentStep === step.number
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-semibold">{step.title}</div>
                      <div className="text-xs opacity-75 hidden sm:block">{step.subtitle}</div>
                    </div>
                  </button>
                  {idx < steps.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 mx-1" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 lg:p-8">
            {renderStepContent()}

            <div className="flex justify-between mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200">
              <button
                onClick={() => currentStep > 1 && setCurrentStep((currentStep - 1) as Step)}
                disabled={currentStep === 1}
                className="px-4 md:px-6 py-2 md:py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
              >
                Back
              </button>
              {currentStep < 5 && (
                <button
                  onClick={() => setCurrentStep((currentStep + 1) as Step)}
                  className="px-4 md:px-6 py-2 md:py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm md:text-base"
                >
                  Next Step
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 lg:sticky lg:top-24">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Customer Preview</h3>
            <div className="aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 p-4 overflow-y-auto">
              <div className="bg-white rounded-lg p-4 mb-4">
                <h4 className="font-bold text-gray-900 mb-2">{serviceData.name}</h4>
                <p className="text-sm text-gray-600 mb-4">{serviceData.description}</p>

                {currentStep === 3 && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs font-medium text-blue-900 mb-2">Pricing Breakdown (6,000 sqft example)</p>
                    {serviceData.pricingModel === 'base_per_sqft' ? (
                      <div className="space-y-1 text-xs text-blue-800">
                        <div className="flex justify-between">
                          <span>Base Price:</span>
                          <span>${serviceData.basePrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Square Footage (6,000 × ${serviceData.perSqftRate}):</span>
                          <span>${(6000 * serviceData.perSqftRate).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-blue-300">
                          <span>Subtotal:</span>
                          <span className="font-medium">${(serviceData.basePrice + (6000 * serviceData.perSqftRate)).toFixed(2)}</span>
                        </div>
                        {serviceData.minimumPrice > (serviceData.basePrice + (6000 * serviceData.perSqftRate)) && (
                          <div className="flex justify-between pt-1 border-t border-blue-300">
                            <span>Minimum Applied:</span>
                            <span className="font-medium">${serviceData.minimumPrice.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between pt-2 border-t border-blue-300 font-semibold">
                          <span>Final Price:</span>
                          <span>${calculatePreviewPrice(6000).toFixed(2)}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1 text-xs text-blue-800">
                        <div className="flex justify-between">
                          <span>Tier Price:</span>
                          <span>${serviceData.pricingTiers.find(t => 6000 >= t.min && 6000 <= t.max)?.price || 0}</span>
                        </div>
                        {serviceData.minimumPrice > (serviceData.pricingTiers.find(t => 6000 >= t.min && 6000 <= t.max)?.price || 0) && (
                          <div className="flex justify-between pt-1 border-t border-blue-300">
                            <span>Minimum Applied:</span>
                            <span className="font-medium">${serviceData.minimumPrice.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between pt-2 border-t border-blue-300 font-semibold">
                          <span>Final Price:</span>
                          <span>${calculatePreviewPrice(6000).toFixed(2)}</span>
                        </div>
                      </div>
                    )}

                    {(serviceData.recurringAdjustments.weekly?.value !== 0 || serviceData.recurringAdjustments.biweekly?.value !== 0 || serviceData.recurringAdjustments.monthly?.value !== 0) && (
                      <div className="mt-3 pt-3 border-t border-blue-300">
                        <p className="text-xs font-medium text-blue-900 mb-2">Recurring Pricing</p>
                        <div className="space-y-1 text-xs text-blue-800">
                          {serviceData.recurringAdjustments.weekly && serviceData.recurringAdjustments.weekly.value !== 0 && (
                            <div className="flex justify-between">
                              <span>Weekly {serviceData.recurringAdjustments.weekly.type === 'percentage' ? `(-${serviceData.recurringAdjustments.weekly.value}%)` : `(-$${serviceData.recurringAdjustments.weekly.value})`}:</span>
                              <span className="font-medium">${getRecurringPrice(calculatePreviewPrice(6000), 'weekly').toFixed(2)}</span>
                            </div>
                          )}
                          {serviceData.recurringAdjustments.biweekly && serviceData.recurringAdjustments.biweekly.value !== 0 && (
                            <div className="flex justify-between">
                              <span>Bi-weekly {serviceData.recurringAdjustments.biweekly.type === 'percentage' ? `(-${serviceData.recurringAdjustments.biweekly.value}%)` : `(-$${serviceData.recurringAdjustments.biweekly.value})`}:</span>
                              <span className="font-medium">${getRecurringPrice(calculatePreviewPrice(6000), 'biweekly').toFixed(2)}</span>
                            </div>
                          )}
                          {serviceData.recurringAdjustments.monthly && serviceData.recurringAdjustments.monthly.value !== 0 && (
                            <div className="flex justify-between">
                              <span>Monthly {serviceData.recurringAdjustments.monthly.type === 'percentage' ? `(-${serviceData.recurringAdjustments.monthly.value}%)` : `(-$${serviceData.recurringAdjustments.monthly.value})`}:</span>
                              <span className="font-medium">${getRecurringPrice(calculatePreviewPrice(6000), 'monthly').toFixed(2)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-2 mb-4">
                  {serviceData.plans.map((plan, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-sm text-gray-900">{plan.name}</p>
                          <p className="text-xs text-gray-500">{plan.frequency}</p>
                        </div>
                        <p className="font-bold text-gray-900">${plan.price}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {serviceData.addons.length > 0 && (
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs font-medium text-gray-700 mb-2">Add-ons</p>
                    {serviceData.addons.map((addon, idx) => (
                      <div key={idx} className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>{addon.name}</span>
                        <span>+${addon.price}</span>
                      </div>
                    ))}
                  </div>
                )}

                {serviceData.depositEnabled && (
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500">Deposit required: ${serviceData.depositAmount}</p>
                  </div>
                )}
              </div>

              <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium">
                Get My Quote
              </button>
            </div>
          </div>
        </div>
      </div>

      {showPublishModal && (
        <>
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40"
            onClick={() => setShowPublishModal(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Publish Service Changes?</h3>
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-4">
                  Your service will be updated with the following changes:
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Updated service description</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Modified pricing plans</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Updated add-on options</span>
                  </li>
                </ul>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPublishModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePublish}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Publish Now
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
