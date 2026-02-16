import { useState } from 'react';
import type { LeadCaptureConfig, LeadCaptureTiming } from './types';
import { LEAD_TIMING_LABELS } from './types';

interface Props {
  config: LeadCaptureConfig;
  onConfigChange: (config: LeadCaptureConfig) => void;
}

const TIMING_OPTIONS: LeadCaptureTiming[] = [
  'before_measurement',
  'after_measurement',
  'before_quote_reveal',
  'disabled',
];

const MICROCOPY = {
  timing: {
    text: 'Controls when visitors are asked for contact info. Capturing after measurement lets them see value before committing.',
    url: '#',
  },
  fields: {
    text: 'Fewer required fields typically increase conversion rates. Email-only is recommended for most use cases.',
    url: '#',
  },
};

export default function LeadCapture({ config, onConfigChange }: Props) {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleFocus = (field: string) => setFocusedField(field);
  const handleBlur = () => setTimeout(() => setFocusedField(null), 150);

  const enabledFieldCount = [config.emailEnabled, config.phoneEnabled, config.nameEnabled].filter(Boolean).length;

  const handleFieldToggle = (field: 'phoneEnabled' | 'nameEnabled', checked: boolean) => {
    const currentOtherField = field === 'phoneEnabled' ? config.nameEnabled : config.phoneEnabled;
    const emailCount = config.emailEnabled ? 1 : 0;
    const otherCount = currentOtherField ? 1 : 0;
    const newCount = emailCount + otherCount + (checked ? 1 : 0);
    if (newCount > 3) return;
    onConfigChange({ ...config, [field]: checked });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-1">Lead Capture</h2>
        <p className="text-sm text-gray-600">Configure when and how you collect visitor information</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Capture Timing</label>
        <div className="space-y-2">
          {TIMING_OPTIONS.map((timing) => (
            <label
              key={timing}
              className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                config.timing === timing
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onFocus={() => handleFocus('timing')}
              onBlur={handleBlur}
            >
              <input
                type="radio"
                name="captureTiming"
                value={timing}
                checked={config.timing === timing}
                onChange={() => onConfigChange({ ...config, timing })}
                className="w-4 h-4 text-green-600"
              />
              <span className={`text-sm font-medium ${config.timing === timing ? 'text-green-900' : 'text-gray-700'}`}>
                {LEAD_TIMING_LABELS[timing]}
              </span>
            </label>
          ))}
        </div>
        {focusedField === 'timing' && (
          <p className="text-xs text-gray-500 mt-2" style={{ animation: 'fadeIn 0.15s ease-out' }}>
            {MICROCOPY.timing.text}{' '}
            <a href={MICROCOPY.timing.url} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 font-medium">
              Learn more
            </a>
          </p>
        )}
      </div>

      {config.timing !== 'disabled' && (
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">Capture Fields</label>
            <span className="text-xs text-gray-500">{enabledFieldCount}/3 fields</span>
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed">
              <input
                type="checkbox"
                checked={config.emailEnabled}
                disabled
                className="w-4 h-4 text-green-600 rounded"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">Email</span>
                <span className="text-xs text-gray-500 ml-2">Required</span>
              </div>
            </label>

            <label
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              onFocus={() => handleFocus('fields')}
              onBlur={handleBlur}
            >
              <input
                type="checkbox"
                checked={config.phoneEnabled}
                onChange={(e) => handleFieldToggle('phoneEnabled', e.target.checked)}
                className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
              />
              <span className="text-sm font-medium text-gray-900">Phone</span>
            </label>

            <label
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              onFocus={() => handleFocus('fields')}
              onBlur={handleBlur}
            >
              <input
                type="checkbox"
                checked={config.nameEnabled}
                onChange={(e) => handleFieldToggle('nameEnabled', e.target.checked)}
                className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
              />
              <span className="text-sm font-medium text-gray-900">Name</span>
            </label>
          </div>
          {focusedField === 'fields' && (
            <p className="text-xs text-gray-500 mt-2" style={{ animation: 'fadeIn 0.15s ease-out' }}>
              {MICROCOPY.fields.text}{' '}
              <a href={MICROCOPY.fields.url} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 font-medium">
                Learn more
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
