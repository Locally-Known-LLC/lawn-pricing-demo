import { useState } from 'react';
import type { StylingConfig, ButtonStyleOption } from './types';

interface Props {
  config: StylingConfig;
  onConfigChange: (config: StylingConfig) => void;
}

const MICROCOPY = {
  color: {
    text: 'This color is used for buttons, links, and active states in your widget. Match it to your brand.',
    url: '#',
  },
  buttonStyle: {
    text: 'Solid buttons tend to draw more attention. Outline buttons blend into minimalist designs.',
    url: '#',
  },
  borderRadius: {
    text: 'Controls how rounded corners appear. 0 = sharp, 8 = default, 16+ = pill-shaped.',
    url: '#',
  },
  customCss: {
    text: 'Use custom CSS only if comfortable with styling. Invalid CSS may break the widget appearance.',
    url: '#',
  },
};

export default function WidgetStyling({ config, onConfigChange }: Props) {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleFocus = (field: string) => setFocusedField(field);
  const handleBlur = () => setTimeout(() => setFocusedField(null), 150);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-1">Styling</h2>
        <p className="text-sm text-gray-600">Match the widget to your brand</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Primary Brand Color</label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={config.primaryColor}
            onChange={(e) => onConfigChange({ ...config, primaryColor: e.target.value })}
            onFocus={() => handleFocus('color')}
            onBlur={handleBlur}
            className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer p-0.5"
          />
          <input
            type="text"
            value={config.primaryColor}
            onChange={(e) => onConfigChange({ ...config, primaryColor: e.target.value })}
            onFocus={() => handleFocus('color')}
            onBlur={handleBlur}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
            placeholder="#16a34a"
          />
        </div>
        {focusedField === 'color' && (
          <p className="text-xs text-gray-500 mt-1.5" style={{ animation: 'fadeIn 0.15s ease-out' }}>
            {MICROCOPY.color.text}{' '}
            <a href={MICROCOPY.color.url} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 font-medium">
              Learn more
            </a>
          </p>
        )}
      </div>

      <div className="pt-4 border-t border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-3">Button Style</label>
        <div className="grid grid-cols-2 gap-3">
          {([
            { value: 'solid' as ButtonStyleOption, label: 'Solid' },
            { value: 'outline' as ButtonStyleOption, label: 'Outline' },
          ]).map((opt) => (
            <label
              key={opt.value}
              className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                config.buttonStyle === opt.value
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onFocus={() => handleFocus('buttonStyle')}
              onBlur={handleBlur}
            >
              <input
                type="radio"
                name="buttonStyle"
                value={opt.value}
                checked={config.buttonStyle === opt.value}
                onChange={() => onConfigChange({ ...config, buttonStyle: opt.value })}
                className="sr-only"
              />
              <div
                className="w-full px-4 py-2 rounded text-sm font-medium text-center transition-colors"
                style={
                  opt.value === 'solid'
                    ? { backgroundColor: config.primaryColor, color: '#fff', borderRadius: `${config.borderRadius}px` }
                    : { border: `2px solid ${config.primaryColor}`, color: config.primaryColor, borderRadius: `${config.borderRadius}px` }
                }
              >
                {config.primaryColor === '#16a34a' ? 'Get Quote' : 'Get Quote'}
              </div>
              <span className={`text-xs font-medium ${config.buttonStyle === opt.value ? 'text-green-700' : 'text-gray-600'}`}>
                {opt.label}
              </span>
            </label>
          ))}
        </div>
        {focusedField === 'buttonStyle' && (
          <p className="text-xs text-gray-500 mt-2" style={{ animation: 'fadeIn 0.15s ease-out' }}>
            {MICROCOPY.buttonStyle.text}{' '}
            <a href={MICROCOPY.buttonStyle.url} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 font-medium">
              Learn more
            </a>
          </p>
        )}
      </div>

      <div className="pt-4 border-t border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">Border Radius</label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="0"
            max="24"
            value={config.borderRadius}
            onChange={(e) => onConfigChange({ ...config, borderRadius: parseInt(e.target.value) })}
            onFocus={() => handleFocus('borderRadius')}
            onBlur={handleBlur}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
          />
          <span className="text-sm font-mono text-gray-700 w-12 text-right">{config.borderRadius}px</span>
        </div>
        {focusedField === 'borderRadius' && (
          <p className="text-xs text-gray-500 mt-1.5" style={{ animation: 'fadeIn 0.15s ease-out' }}>
            {MICROCOPY.borderRadius.text}{' '}
            <a href={MICROCOPY.borderRadius.url} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 font-medium">
              Learn more
            </a>
          </p>
        )}
      </div>

      <div className="pt-4 border-t border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">Custom CSS</label>
        <textarea
          value={config.customCss}
          onChange={(e) => onConfigChange({ ...config, customCss: e.target.value })}
          onFocus={() => handleFocus('customCss')}
          onBlur={handleBlur}
          rows={5}
          placeholder=".lp-widget { /* your styles */ }"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
        />
        {focusedField === 'customCss' && (
          <p className="text-xs text-gray-500 mt-1.5" style={{ animation: 'fadeIn 0.15s ease-out' }}>
            {MICROCOPY.customCss.text}{' '}
            <a href={MICROCOPY.customCss.url} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 font-medium">
              Learn more
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
