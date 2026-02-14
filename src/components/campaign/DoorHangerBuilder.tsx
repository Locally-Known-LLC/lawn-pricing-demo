import { Upload, Eye } from 'lucide-react';
import { useState } from 'react';

interface DoorHangerBuilderProps {
  onNext: () => void;
  onBack: () => void;
}

export default function DoorHangerBuilder({ onNext, onBack }: DoorHangerBuilderProps) {
  const [headline, setHeadline] = useState('Your Lawn Deserves Better');
  const [subheadline, setSubheadline] = useState('Professional Lawn Care Made Simple');
  const [offer, setOffer] = useState('Get 20% off your first service');
  const [ctaText, setCtaText] = useState('Scan to Get Your Instant Quote');
  const [brandColor, setBrandColor] = useState('#16a34a');
  const [includeImage, setIncludeImage] = useState(true);
  const [highlightArea, setHighlightArea] = useState(true);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Customize Door Hanger</h1>
        <p className="text-sm md:text-base text-gray-600">Design your door hanger template</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
          <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4 md:mb-6">Template Settings</h2>

          <div className="space-y-4 md:space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Headline
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full px-4 py-2.5 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subheadline
              </label>
              <input
                type="text"
                value={subheadline}
                onChange={(e) => setSubheadline(e.target.value)}
                className="w-full px-4 py-2.5 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Offer Text
              </label>
              <textarea
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
                rows={2}
                className="w-full px-4 py-2.5 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CTA Button Text
              </label>
              <input
                type="text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                className="w-full px-4 py-2.5 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo Upload
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-400 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Upload your logo</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  className="flex-1 px-4 py-2.5 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
                />
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-200">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeImage}
                  onChange={(e) => setIncludeImage(e.target.checked)}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <span className="text-sm font-medium text-gray-700">Include property image</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={highlightArea}
                  onChange={(e) => setHighlightArea(e.target.checked)}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <span className="text-sm font-medium text-gray-700">Highlight lawn area</span>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-base md:text-lg font-semibold text-gray-900">Preview</h2>
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-green-600 hover:text-green-700 font-medium">
              <Eye className="w-4 h-4" />
              Full Preview
            </button>
          </div>

          <div className="aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-gray-200 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-lg" style={{ backgroundColor: brandColor }} />
              <div className="text-xs text-gray-500">Door Hanger</div>
            </div>

            {includeImage && (
              <div className="w-full h-32 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                <div className="text-xs text-gray-400">Property Image</div>
              </div>
            )}

            <div className="flex-1 flex flex-col justify-center text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{headline}</h3>
              <p className="text-sm text-gray-600 mb-4">{subheadline}</p>

              <div className="bg-white rounded-lg p-4 border-2 border-gray-200 mb-4">
                <div className="text-sm text-gray-500 mb-1">123 Maple Street</div>
                <div className="text-2xl font-bold" style={{ color: brandColor }}>$55</div>
                <div className="text-xs text-gray-500 mt-1">5,200 sq ft lawn</div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-sm font-medium text-gray-900">{offer}</p>
              </div>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-white rounded-lg mx-auto mb-2 border border-gray-300 flex items-center justify-center">
                <div className="text-xs text-gray-400">QR Code</div>
              </div>
              <p className="text-xs font-medium text-gray-700">{ctaText}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6 md:mt-8">
        <button
          onClick={onBack}
          className="px-4 md:px-6 py-3 md:py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm md:text-base"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="px-4 md:px-6 py-3 md:py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm md:text-base"
        >
          Preview All Variations
        </button>
      </div>
    </div>
  );
}
