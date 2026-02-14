import { ChevronRight, Save, Upload, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

type Step = 1 | 2 | 3 | 4 | 5;

interface ServiceData {
  name: string;
  description: string;
  plans: Array<{ name: string; price: number; frequency: string }>;
  addons: Array<{ name: string; price: number }>;
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
    addons: [
      { name: 'Edge Trimming', price: 15 },
      { name: 'Leaf Removal', price: 25 },
    ],
    depositEnabled: true,
    depositAmount: 50,
    status: 'live',
  });

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

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-medium text-gray-900">Small Properties</p>
                    <p className="text-sm text-gray-500">Under 5,000 sq ft</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Base price multiplier</p>
                    <p className="text-lg font-bold text-gray-900">1.0x</p>
                  </div>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  defaultValue="1"
                  className="w-full"
                />
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-medium text-gray-900">Medium Properties</p>
                    <p className="text-sm text-gray-500">5,000 - 10,000 sq ft</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Base price multiplier</p>
                    <p className="text-lg font-bold text-gray-900">1.2x</p>
                  </div>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  defaultValue="1.2"
                  className="w-full"
                />
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-medium text-gray-900">Large Properties</p>
                    <p className="text-sm text-gray-500">Over 10,000 sq ft</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Base price multiplier</p>
                    <p className="text-lg font-bold text-gray-900">1.5x</p>
                  </div>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  defaultValue="1.5"
                  className="w-full"
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                These multipliers adjust your base plan prices automatically based on measured lawn size
              </p>
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
                        Price
                      </label>
                      <input
                        type="number"
                        value={addon.price}
                        onChange={(e) => {
                          const newAddons = [...serviceData.addons];
                          newAddons[idx].price = parseInt(e.target.value);
                          setServiceData({ ...serviceData, addons: newAddons });
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full px-4 py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-green-400 hover:text-green-600 transition-colors font-medium">
              + Add Another Add-on
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
            <div className="aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 p-4">
              <div className="bg-white rounded-lg p-4 mb-4">
                <h4 className="font-bold text-gray-900 mb-2">{serviceData.name}</h4>
                <p className="text-sm text-gray-600 mb-4">{serviceData.description}</p>

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
