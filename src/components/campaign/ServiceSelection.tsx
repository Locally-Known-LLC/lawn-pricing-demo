import { ChevronDown, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface ServiceSelectionProps {
  onNext: () => void;
  onBack: () => void;
}

export default function ServiceSelection({ onNext, onBack }: ServiceSelectionProps) {
  const [service, setService] = useState('mowing');
  const [priceDisplay, setPriceDisplay] = useState('exact');
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onNext();
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Select Service Template</h1>
        <p className="text-sm md:text-base text-gray-600">Choose the service and pricing display options</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-8 mb-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Service Type
          </label>
          <div className="relative">
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
            >
              <option value="mowing">Lawn Mowing</option>
              <option value="fertilization">Fertilization</option>
              <option value="aeration">Aeration</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Pricing Preview</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500 mb-1">Small Lot</p>
              <p className="text-lg font-semibold text-gray-900">$35</p>
              <p className="text-xs text-gray-500">Under 5,000 sq ft</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Medium Lot</p>
              <p className="text-lg font-semibold text-gray-900">$55</p>
              <p className="text-xs text-gray-500">5,000 - 10,000 sq ft</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Large Lot</p>
              <p className="text-lg font-semibold text-gray-900">$85</p>
              <p className="text-xs text-gray-500">Over 10,000 sq ft</p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Price Display Options
          </label>
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="priceDisplay"
                value="exact"
                checked={priceDisplay === 'exact'}
                onChange={(e) => setPriceDisplay(e.target.value)}
                className="mt-1 w-4 h-4 text-green-600 focus:ring-green-500"
              />
              <div>
                <p className="font-medium text-gray-900">Show exact price on door hanger</p>
                <p className="text-sm text-gray-500">Display the calculated price for each property</p>
              </div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="priceDisplay"
                value="starting"
                checked={priceDisplay === 'starting'}
                onChange={(e) => setPriceDisplay(e.target.value)}
                className="mt-1 w-4 h-4 text-green-600 focus:ring-green-500"
              />
              <div>
                <p className="font-medium text-gray-900">Show "Starting at" price</p>
                <p className="text-sm text-gray-500">Display your lowest service price</p>
              </div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="priceDisplay"
                value="hidden"
                checked={priceDisplay === 'hidden'}
                onChange={(e) => setPriceDisplay(e.target.value)}
                className="mt-1 w-4 h-4 text-green-600 focus:ring-green-500"
              />
              <div>
                <p className="font-medium text-gray-900">Hide price (QR reveals quote)</p>
                <p className="text-sm text-gray-500">Customer scans QR code to see their custom quote</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <button
          onClick={onBack}
          className="px-4 md:px-6 py-3 md:py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm md:text-base"
        >
          Back
        </button>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="px-4 md:px-6 py-3 md:py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 text-sm md:text-base"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="hidden sm:inline">Generating 350 Quotes...</span>
              <span className="sm:hidden">Generating...</span>
            </>
          ) : (
            <>Generate 350 Quotes</>
          )}
        </button>
      </div>
    </div>
  );
}
