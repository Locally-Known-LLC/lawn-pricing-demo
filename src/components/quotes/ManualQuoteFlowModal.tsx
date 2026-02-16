import { X, Edit2 } from 'lucide-react';

type QuickQuoteStep = 1 | 2 | 3 | 4 | 5;

interface Props {
  show: boolean;
  step: QuickQuoteStep;
  calculatedPrice: number;
  showPriceOverride: boolean;
  overridePrice: string;
  overrideReason: string;
  onClose: () => void;
  onStepChange: (step: QuickQuoteStep) => void;
  onShowPriceOverrideChange: (show: boolean) => void;
  onOverridePriceChange: (price: string) => void;
  onOverrideReasonChange: (reason: string) => void;
  onSend: () => void;
}

export default function ManualQuoteFlowModal({
  show,
  step,
  calculatedPrice,
  showPriceOverride,
  overridePrice,
  overrideReason,
  onClose,
  onStepChange,
  onShowPriceOverrideChange,
  onOverridePriceChange,
  onOverrideReasonChange,
  onSend,
}: Props) {
  if (!show) return null;

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">Property Address</h3>
              <p className="text-sm text-gray-600 mb-4">Enter the property address to measure lawn size</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
              <input
                type="text"
                placeholder="123 Main St"
                className="w-full px-4 py-2.5 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  placeholder="Springfield"
                  className="w-full px-4 py-2.5 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  placeholder="IL"
                  className="w-full px-4 py-2.5 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">We'll automatically measure the lawn area using satellite imagery</p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">Select Plan</h3>
              <p className="text-sm text-gray-600 mb-4">Choose a service plan for this property</p>
            </div>
            <div className="space-y-3">
              {['Basic', 'Standard', 'Premium'].map((plan) => (
                <label key={plan} className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
                  <input type="radio" name="plan" className="w-4 h-4 text-green-600" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{plan}</p>
                    <p className="text-sm text-gray-500">Weekly service</p>
                  </div>
                  <p className="font-bold text-gray-900">${plan === 'Basic' ? 45 : plan === 'Standard' ? 55 : 75}</p>
                </label>
              ))}
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-600">
                <strong>Measured lawn size:</strong> 5,200 sq ft
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">Add-ons</h3>
              <p className="text-sm text-gray-600 mb-4">Select optional services</p>
            </div>
            <div className="space-y-3">
              {[
                { name: 'Edge Trimming', price: 15 },
                { name: 'Leaf Removal', price: 25 },
                { name: 'Fertilization', price: 40 },
              ].map((addon) => (
                <label key={addon.name} className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input type="checkbox" className="w-4 h-4 text-green-600 rounded" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{addon.name}</p>
                  </div>
                  <p className="font-medium text-gray-600">+${addon.price}</p>
                </label>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">Quote Summary</h3>
              <p className="text-sm text-gray-600 mb-4">Review and confirm the details</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Property</span>
                <span className="font-medium text-gray-900">123 Main St</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Plan</span>
                <span className="font-medium text-gray-900">Standard - Weekly</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Calculated Price</span>
                <span className="font-medium text-gray-900">${calculatedPrice}</span>
              </div>
              {!showPriceOverride && (
                <button
                  onClick={() => onShowPriceOverrideChange(true)}
                  className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" />
                  Adjust price manually
                </button>
              )}
              {showPriceOverride && (
                <div className="pt-3 border-t border-gray-200 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Override Price ($)</label>
                    <input
                      type="number"
                      value={overridePrice}
                      onChange={(e) => onOverridePriceChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason (optional)</label>
                    <input
                      type="text"
                      value={overrideReason}
                      onChange={(e) => onOverrideReasonChange(e.target.value)}
                      placeholder="e.g., Additional travel distance"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    />
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-2">
                    <p className="text-xs text-amber-800 font-medium">Manual Adjustment Applied</p>
                  </div>
                </div>
              )}
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-gray-900">${showPriceOverride ? overridePrice : calculatedPrice}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">Customer Details</h3>
              <p className="text-sm text-gray-600 mb-4">Enter customer information to send the quote</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                placeholder="John Smith"
                className="w-full px-4 py-2.5 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                placeholder="john@email.com"
                className="w-full px-4 py-2.5 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                placeholder="(555) 123-4567"
                className="w-full px-4 py-2.5 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">Customer will receive an email with their personalized quote and payment link</p>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900">Quick Quote</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-2 -m-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className={`flex-1 h-2 rounded-full ${
                    s <= step ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="p-4 md:p-6">
            {renderStep()}
          </div>

          <div className="p-4 md:p-6 border-t border-gray-200 flex justify-between">
            <button
              onClick={() => step > 1 && onStepChange((step - 1) as QuickQuoteStep)}
              disabled={step === 1}
              className="px-4 md:px-6 py-2.5 md:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 text-sm md:text-base"
            >
              Back
            </button>
            {step < 5 ? (
              <button
                onClick={() => onStepChange((step + 1) as QuickQuoteStep)}
                className="px-4 md:px-6 py-2.5 md:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm md:text-base"
              >
                Next
              </button>
            ) : (
              <button
                onClick={onSend}
                className="px-4 md:px-6 py-2.5 md:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm md:text-base"
              >
                Send Quote
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
