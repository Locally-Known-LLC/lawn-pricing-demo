import { ChevronRight, Save, CheckCircle2, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import ServiceBasicsStep from './service/ServiceBasicsStep';
import ServicePlansStep from './service/ServicePlansStep';
import ServicePricingStep from './service/ServicePricingStep';
import ServiceAddOnsStep from './service/ServiceAddOnsStep';
import ServiceDepositPublishStep from './service/ServiceDepositPublishStep';
import { PricingTier, RecurringAdjustment, calculatePrice, calculateRecurringPrices } from '../utils/pricingEngine';
import { Addon } from './service/ServiceAddOnsStep';

type Step = 1 | 2 | 3 | 4 | 5;

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
  hasUnpublishedChanges: boolean;
  originalLiveState?: ServiceData;
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
    hasUnpublishedChanges: false,
  });

  const handleServiceChange = (updates: Partial<ServiceData>) => {
    const updatedService = { ...serviceData, ...updates };

    if (serviceData.status === 'live' && !serviceData.hasUnpublishedChanges) {
      updatedService.hasUnpublishedChanges = true;
      updatedService.originalLiveState = { ...serviceData };
    }

    setServiceData(updatedService);
  };

  const handlePublish = () => {
    setShowPublishModal(false);
    setServiceData({
      ...serviceData,
      status: 'live',
      hasUnpublishedChanges: false,
      originalLiveState: undefined,
    });
  };

  const handleRevertToLive = () => {
    if (serviceData.originalLiveState) {
      setServiceData({ ...serviceData.originalLiveState, originalLiveState: undefined });
    }
  };

  const steps = [
    { number: 1, title: 'Basics', subtitle: 'Service details' },
    { number: 2, title: 'Plans', subtitle: 'Pricing tiers' },
    { number: 3, title: 'Pricing', subtitle: 'Configure rates' },
    { number: 4, title: 'Add-ons', subtitle: 'Extra services' },
    { number: 5, title: 'Deposit', subtitle: 'Payment terms' },
  ];

  const getStatusLabel = () => {
    if (serviceData.status === 'live' && serviceData.hasUnpublishedChanges) {
      return 'Draft (Unpublished Changes)';
    }
    return serviceData.status === 'live' ? 'Live' : 'Draft';
  };

  const getStatusColor = () => {
    if (serviceData.status === 'live' && serviceData.hasUnpublishedChanges) {
      return 'bg-yellow-100 text-yellow-800';
    }
    return serviceData.status === 'live' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ServiceBasicsStep
            name={serviceData.name}
            description={serviceData.description}
            onNameChange={(name) => handleServiceChange({ name })}
            onDescriptionChange={(description) => handleServiceChange({ description })}
          />
        );

      case 2:
        return (
          <ServicePlansStep
            plans={serviceData.plans}
            onPlansChange={(plans) => handleServiceChange({ plans })}
          />
        );

      case 3:
        return (
          <ServicePricingStep
            pricingModel={serviceData.pricingModel}
            basePrice={serviceData.basePrice}
            perSqftRate={serviceData.perSqftRate}
            pricingTiers={serviceData.pricingTiers}
            minimumPrice={serviceData.minimumPrice}
            recurringAdjustments={serviceData.recurringAdjustments}
            onPricingModelChange={(pricingModel) => handleServiceChange({ pricingModel })}
            onBasePriceChange={(basePrice) => handleServiceChange({ basePrice })}
            onPerSqftRateChange={(perSqftRate) => handleServiceChange({ perSqftRate })}
            onPricingTiersChange={(pricingTiers) => handleServiceChange({ pricingTiers })}
            onMinimumPriceChange={(minimumPrice) => handleServiceChange({ minimumPrice })}
            onRecurringAdjustmentsChange={(recurringAdjustments) => handleServiceChange({ recurringAdjustments })}
          />
        );

      case 4:
        return (
          <ServiceAddOnsStep
            addons={serviceData.addons}
            onAddonsChange={(addons) => handleServiceChange({ addons })}
          />
        );

      case 5:
        return (
          <ServiceDepositPublishStep
            depositEnabled={serviceData.depositEnabled}
            depositAmount={serviceData.depositAmount}
            onDepositEnabledChange={(depositEnabled) => handleServiceChange({ depositEnabled })}
            onDepositAmountChange={(depositAmount) => handleServiceChange({ depositAmount })}
          />
        );
    }
  };

  const previewSqft = 6000;
  const pricingBreakdown = calculatePrice(
    previewSqft,
    serviceData.pricingModel,
    serviceData.basePrice,
    serviceData.perSqftRate,
    serviceData.pricingTiers,
    serviceData.minimumPrice
  );
  const recurringPrices = calculateRecurringPrices(pricingBreakdown.finalPrice, serviceData.recurringAdjustments);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 md:gap-3 mb-2">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">Service Configuration</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
              {getStatusLabel()}
            </span>
            {serviceData.hasUnpublishedChanges && (
              <button
                onClick={handleRevertToLive}
                className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Revert
              </button>
            )}
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
                    <p className="text-xs font-medium text-blue-900 mb-3">Pricing Breakdown ({previewSqft.toLocaleString()} sqft example)</p>
                    <div className="space-y-2 text-xs text-blue-800">
                      {serviceData.pricingModel === 'base_per_sqft' ? (
                        <>
                          <div className="flex justify-between">
                            <span>Base Rate:</span>
                            <span className="font-medium">${pricingBreakdown.baseRate.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Square Footage ({previewSqft.toLocaleString()} × ${serviceData.perSqftRate}):</span>
                            <span className="font-medium">+${pricingBreakdown.sqftCalculation.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-blue-300">
                            <span>Subtotal:</span>
                            <span className="font-medium">${pricingBreakdown.subtotal.toFixed(2)}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex justify-between">
                            <span>Tier Price:</span>
                            <span className="font-medium">${pricingBreakdown.baseRate.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-blue-300">
                            <span>Subtotal:</span>
                            <span className="font-medium">${pricingBreakdown.subtotal.toFixed(2)}</span>
                          </div>
                        </>
                      )}

                      {pricingBreakdown.minimumApplied && (
                        <div className="flex justify-between pt-2 border-t border-blue-300">
                          <span>Minimum Floor Applied:</span>
                          <span className="font-medium">${pricingBreakdown.minimumAmount.toFixed(2)}</span>
                        </div>
                      )}

                      <div className="flex justify-between pt-2 border-t-2 border-blue-400 font-semibold">
                        <span>Final Price:</span>
                        <span>${pricingBreakdown.finalPrice.toFixed(2)}</span>
                      </div>
                    </div>

                    {(recurringPrices.weekly !== undefined || recurringPrices.biweekly !== undefined || recurringPrices.monthly !== undefined) && (
                      <div className="mt-3 pt-3 border-t border-blue-300">
                        <p className="text-xs font-medium text-blue-900 mb-2">Recurring Pricing</p>
                        <div className="space-y-1 text-xs text-blue-800">
                          {recurringPrices.weekly !== undefined && serviceData.recurringAdjustments.weekly?.value !== 0 && (
                            <div className="flex justify-between">
                              <span>Weekly {serviceData.recurringAdjustments.weekly.type === 'percentage' ? `(-${serviceData.recurringAdjustments.weekly.value}%)` : `(-$${serviceData.recurringAdjustments.weekly.value})`}:</span>
                              <span className="font-medium">${recurringPrices.weekly.toFixed(2)}</span>
                            </div>
                          )}
                          {recurringPrices.biweekly !== undefined && serviceData.recurringAdjustments.biweekly?.value !== 0 && (
                            <div className="flex justify-between">
                              <span>Bi-weekly {serviceData.recurringAdjustments.biweekly.type === 'percentage' ? `(-${serviceData.recurringAdjustments.biweekly.value}%)` : `(-$${serviceData.recurringAdjustments.biweekly.value})`}:</span>
                              <span className="font-medium">${recurringPrices.biweekly.toFixed(2)}</span>
                            </div>
                          )}
                          {recurringPrices.monthly !== undefined && serviceData.recurringAdjustments.monthly?.value !== 0 && (
                            <div className="flex justify-between">
                              <span>Monthly {serviceData.recurringAdjustments.monthly.type === 'percentage' ? `(-${serviceData.recurringAdjustments.monthly.value}%)` : `(-$${serviceData.recurringAdjustments.monthly.value})`}:</span>
                              <span className="font-medium">${recurringPrices.monthly.toFixed(2)}</span>
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
