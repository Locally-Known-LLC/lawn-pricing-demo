import { useState } from 'react';
import type { ConversionConfig, QuoteDisplayMode } from './types';

interface Props {
  config: ConversionConfig;
  onConfigChange: (config: ConversionConfig) => void;
}

const EXPIRATION_OPTIONS = [
  { value: 3, label: '3 days' },
  { value: 7, label: '7 days' },
  { value: 14, label: '14 days' },
  { value: 30, label: '30 days' },
];

const MICROCOPY = {
  deposit: {
    text: 'Requiring deposits may increase commitment but can reduce initial acceptance rates. Test with your audience.',
    url: '#',
  },
  quoteDisplay: {
    text: '"Starting At" pricing can reduce sticker shock for higher-end properties. Exact pricing builds trust with transparent customers.',
    url: '#',
  },
  expiration: {
    text: 'Shorter expirations create urgency. Longer windows reduce pressure. 7 days is the most common choice.',
    url: '#',
  },
};

export default function ConversionControls({ config, onConfigChange }: Props) {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleFocus = (field: string) => setFocusedField(field);
  const handleBlur = () => setTimeout(() => setFocusedField(null), 150);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-1">Conversion Controls</h2>
        <p className="text-sm text-gray-600">Fine-tune how quotes are presented and accepted</p>
      </div>

      <div>
        <label
          className="flex items-center gap-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          onFocus={() => handleFocus('deposit')}
          onBlur={handleBlur}
        >
          <input
            type="checkbox"
            checked={config.depositRequired}
            onChange={(e) => onConfigChange({ ...config, depositRequired: e.target.checked })}
            className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
          />
          <div>
            <p className="font-medium text-gray-900 text-sm">Require deposit before acceptance</p>
            <p className="text-xs text-gray-500 mt-0.5">Customers must pay a deposit to confirm their quote</p>
          </div>
        </label>
        {focusedField === 'deposit' && (
          <p className="text-xs text-gray-500 mt-2" style={{ animation: 'fadeIn 0.15s ease-out' }}>
            {MICROCOPY.deposit.text}{' '}
            <a href={MICROCOPY.deposit.url} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 font-medium">
              Learn more
            </a>
          </p>
        )}
      </div>

      <div className="pt-4 border-t border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-3">Quote Display</label>
        <div className="space-y-2">
          {([
            { value: 'exact' as QuoteDisplayMode, label: 'Show Exact Price', desc: 'Display the calculated price as-is' },
            { value: 'starting_at' as QuoteDisplayMode, label: 'Show "Starting At"', desc: 'Prefix price with "Starting at" language' },
          ]).map((opt) => (
            <label
              key={opt.value}
              className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                config.quoteDisplay === opt.value
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onFocus={() => handleFocus('quoteDisplay')}
              onBlur={handleBlur}
            >
              <input
                type="radio"
                name="quoteDisplay"
                value={opt.value}
                checked={config.quoteDisplay === opt.value}
                onChange={() => onConfigChange({ ...config, quoteDisplay: opt.value })}
                className="w-4 h-4 text-green-600"
              />
              <div>
                <span className={`text-sm font-medium ${config.quoteDisplay === opt.value ? 'text-green-900' : 'text-gray-700'}`}>
                  {opt.label}
                </span>
                <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
              </div>
            </label>
          ))}
        </div>
        {focusedField === 'quoteDisplay' && (
          <p className="text-xs text-gray-500 mt-2" style={{ animation: 'fadeIn 0.15s ease-out' }}>
            {MICROCOPY.quoteDisplay.text}{' '}
            <a href={MICROCOPY.quoteDisplay.url} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 font-medium">
              Learn more
            </a>
          </p>
        )}
      </div>

      <div className="pt-4 border-t border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">Quote Expiration</label>
        <select
          value={config.quoteExpirationDays}
          onChange={(e) => onConfigChange({ ...config, quoteExpirationDays: parseInt(e.target.value) })}
          onFocus={() => handleFocus('expiration')}
          onBlur={handleBlur}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          {EXPIRATION_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {focusedField === 'expiration' && (
          <p className="text-xs text-gray-500 mt-1.5" style={{ animation: 'fadeIn 0.15s ease-out' }}>
            {MICROCOPY.expiration.text}{' '}
            <a href={MICROCOPY.expiration.url} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 font-medium">
              Learn more
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
