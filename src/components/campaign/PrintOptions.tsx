import { Download, Package, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

interface PrintOptionsProps {
  onBack: () => void;
  onComplete: () => void;
}

export default function PrintOptions({ onBack, onComplete }: PrintOptionsProps) {
  const [paperType, setPaperType] = useState('standard');
  const [shipping, setShipping] = useState('standard');
  const [showSuccess, setShowSuccess] = useState(false);

  const quantity = 350;
  const baseCost = quantity * 0.35;
  const paperCost = paperType === 'premium' ? quantity * 0.15 : 0;
  const shippingCost = shipping === 'expedited' ? 45 : 15;
  const totalCost = baseCost + paperCost + shippingCost;

  const handleOrderPrint = () => {
    setShowSuccess(true);
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  if (showSuccess) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12 md:py-16 px-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
        <p className="text-sm md:text-base text-gray-600">Your door hangers will be printed and shipped within 3-5 business days.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Print & Ship</h1>
        <p className="text-sm md:text-base text-gray-600">Choose your printing and delivery options</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 md:mb-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
            <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Print Options</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={`${quantity} pieces`}
                  disabled
                  className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Paper Quality
              </label>
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
                  style={{ borderColor: paperType === 'standard' ? '#16a34a' : '#d1d5db' }}>
                  <input
                    type="radio"
                    name="paper"
                    value="standard"
                    checked={paperType === 'standard'}
                    onChange={(e) => setPaperType(e.target.value)}
                    className="mt-1 w-4 h-4 text-green-600 focus:ring-green-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-gray-900">Standard</p>
                      <p className="text-sm text-gray-600">$0.35/piece</p>
                    </div>
                    <p className="text-sm text-gray-500">14pt cardstock, matte finish</p>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
                  style={{ borderColor: paperType === 'premium' ? '#16a34a' : '#d1d5db' }}>
                  <input
                    type="radio"
                    name="paper"
                    value="premium"
                    checked={paperType === 'premium'}
                    onChange={(e) => setPaperType(e.target.value)}
                    className="mt-1 w-4 h-4 text-green-600 focus:ring-green-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-gray-900">Premium</p>
                      <p className="text-sm text-gray-600">$0.50/piece</p>
                    </div>
                    <p className="text-sm text-gray-500">16pt cardstock, UV gloss coating</p>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Shipping Speed
              </label>
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
                  style={{ borderColor: shipping === 'standard' ? '#16a34a' : '#d1d5db' }}>
                  <input
                    type="radio"
                    name="shipping"
                    value="standard"
                    checked={shipping === 'standard'}
                    onChange={(e) => setShipping(e.target.value)}
                    className="mt-1 w-4 h-4 text-green-600 focus:ring-green-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-gray-900">Standard Shipping</p>
                      <p className="text-sm text-gray-600">$15.00</p>
                    </div>
                    <p className="text-sm text-gray-500">Delivery in 5-7 business days</p>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
                  style={{ borderColor: shipping === 'expedited' ? '#16a34a' : '#d1d5db' }}>
                  <input
                    type="radio"
                    name="shipping"
                    value="expedited"
                    checked={shipping === 'expedited'}
                    onChange={(e) => setShipping(e.target.value)}
                    className="mt-1 w-4 h-4 text-green-600 focus:ring-green-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-gray-900">Expedited Shipping</p>
                      <p className="text-sm text-gray-600">$45.00</p>
                    </div>
                    <p className="text-sm text-gray-500">Delivery in 2-3 business days</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 lg:sticky lg:top-24">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>

            <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Printing ({quantity})</span>
                <span className="text-gray-900">${baseCost.toFixed(2)}</span>
              </div>
              {paperType === 'premium' && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Premium upgrade</span>
                  <span className="text-gray-900">${paperCost.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">${shippingCost.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between mb-6">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-lg font-semibold text-gray-900">${totalCost.toFixed(2)}</span>
            </div>

            <div className="space-y-3">
              <button
                onClick={onComplete}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium text-sm md:text-base"
              >
                <Download className="w-5 h-5" />
                Download PDF
              </button>
              <button
                onClick={handleOrderPrint}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm md:text-base"
              >
                <Package className="w-5 h-5" />
                Order Print & Ship
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-4 text-center">
              Secure checkout powered by Stripe
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-start">
        <button
          onClick={onBack}
          className="px-4 md:px-6 py-3 md:py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm md:text-base"
        >
          Back
        </button>
      </div>
    </div>
  );
}
