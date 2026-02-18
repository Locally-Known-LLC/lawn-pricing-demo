import { useState } from 'react';
import { X, MapPin, ArrowRight, ChevronLeft } from 'lucide-react';
import type { HostedPageConfig, StylingConfig, EntryConfig } from './types';

interface Props {
  config: HostedPageConfig;
  stylingConfig: StylingConfig;
  entryConfig: EntryConfig;
  onClose: () => void;
}

type PreviewStep = 'landing' | 'quote';

export default function HostedPagePreviewModal({ config, stylingConfig, entryConfig, onClose }: Props) {
  const [step, setStep] = useState<PreviewStep>('landing');
  const [address, setAddress] = useState('');

  const btnBg = stylingConfig.primaryColor;
  const btnRadius = `${stylingConfig.borderRadius}px`;

  const handleSubmit = () => {
    if (address.trim().length > 2) {
      setStep('quote');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col" style={{ maxHeight: '90vh' }}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <div className="w-2 h-2 rounded-full bg-yellow-400" />
              <div className="w-2 h-2 rounded-full bg-green-400" />
            </div>
            <span className="text-xs text-gray-400 font-mono">
              lawnpricing.com/{config.slug || 'your-page'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 -mr-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {step === 'landing' ? (
            <div className="px-6 py-10 space-y-7">
              <div className="flex flex-col items-center gap-2 text-center">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-base font-bold"
                  style={{ backgroundColor: btnBg }}
                >
                  {(config.companyName || 'L').charAt(0).toUpperCase()}
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {config.companyName || 'Your Company'}
                </p>
              </div>

              <div className="text-center space-y-1.5">
                <h1 className="text-xl font-bold text-gray-900 leading-tight">
                  Get an instant lawn care quote
                </h1>
                <p className="text-sm text-gray-500">{entryConfig.supportingMicrocopy}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:border-transparent" style={{ '--tw-ring-color': btnBg } as React.CSSProperties}>
                  <div className="px-3 py-3 bg-gray-50 border-r border-gray-200">
                    <MapPin className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    placeholder={entryConfig.addressPlaceholder}
                    className="flex-1 px-3 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  className="w-full py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: stylingConfig.buttonStyle === 'outline' ? 'transparent' : btnBg,
                    color: stylingConfig.buttonStyle === 'outline' ? btnBg : 'white',
                    border: stylingConfig.buttonStyle === 'outline' ? `2px solid ${btnBg}` : 'none',
                    borderRadius: btnRadius,
                  }}
                >
                  {entryConfig.buttonText}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <span className="text-xs text-gray-300">Privacy</span>
                <span className="text-xs text-gray-300">·</span>
                <span className="text-xs text-gray-300">Terms</span>
                <span className="text-xs text-gray-300">·</span>
                <span className="text-xs text-gray-300">Powered by LawnPricing</span>
              </div>
            </div>
          ) : (
            <div className="px-6 py-10 space-y-6">
              <button
                onClick={() => setStep('landing')}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>

              <div className="space-y-1">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Measuring property</p>
                <p className="text-sm font-medium text-gray-900 truncate">{address}</p>
              </div>

              <div className="bg-gray-100 rounded-xl h-32 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-8 h-8 rounded-full border-2 border-gray-300 border-t-transparent animate-spin mx-auto mb-2" style={{ borderTopColor: btnBg }} />
                  <p className="text-xs text-gray-500">Calculating property size...</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Estimated lawn size</span>
                  <span className="text-sm font-semibold text-gray-900">~4,200 sq ft</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Service</span>
                  <span className="text-sm font-semibold text-gray-900">Weekly Mowing</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Estimated quote</span>
                  <span className="text-lg font-bold text-gray-900">$48 / visit</span>
                </div>
              </div>

              <button
                className="w-full py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: stylingConfig.buttonStyle === 'outline' ? 'transparent' : btnBg,
                  color: stylingConfig.buttonStyle === 'outline' ? btnBg : 'white',
                  border: stylingConfig.buttonStyle === 'outline' ? `2px solid ${btnBg}` : 'none',
                  borderRadius: btnRadius,
                }}
              >
                Reserve with Deposit
              </button>

              <div className="flex items-center justify-center gap-3">
                <span className="text-xs text-gray-300">Privacy</span>
                <span className="text-xs text-gray-300">·</span>
                <span className="text-xs text-gray-300">Terms</span>
                <span className="text-xs text-gray-300">·</span>
                <span className="text-xs text-gray-300">Powered by LawnPricing</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
