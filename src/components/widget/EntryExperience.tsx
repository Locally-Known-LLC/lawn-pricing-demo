import { useState } from 'react';
import { Monitor, MessageSquare, PanelRightOpen, MousePointer, AlertCircle } from 'lucide-react';
import type { DisplayType, EntryConfig, Service } from './types';

interface Props {
  displayType: DisplayType;
  config: EntryConfig;
  services: Service[];
  linkedServiceId: string | null;
  linkedServiceStatus: 'draft' | 'live' | null;
  onDisplayTypeChange: (type: DisplayType) => void;
  onConfigChange: (config: EntryConfig) => void;
  onServiceChange: (serviceId: string, serviceName: string, serviceStatus: 'draft' | 'live') => void;
  onCreateService: () => void;
}

const DISPLAY_OPTIONS: { value: DisplayType; label: string; icon: typeof Monitor }[] = [
  { value: 'inline', label: 'Inline Embed', icon: Monitor },
  { value: 'popup', label: 'Popup Modal', icon: MessageSquare },
  { value: 'slide_out', label: 'Slide-Out Panel', icon: PanelRightOpen },
  { value: 'floating_button', label: 'Floating Button', icon: MousePointer },
];

const MICROCOPY: Record<string, { text: string; url: string }> = {
  displayType: {
    text: 'Choose how the widget appears on your site. Inline works best for dedicated pricing pages; popup and slide-out suit homepages or landing pages.',
    url: '#',
  },
  addressPlaceholder: {
    text: 'This text appears in the address input before the visitor types. Keep it clear and action-oriented.',
    url: '#',
  },
  buttonText: {
    text: 'The primary call-to-action label. Short, direct copy typically outperforms longer text.',
    url: '#',
  },
  supportingMicrocopy: {
    text: 'A brief line beneath the address field that sets expectations. One sentence is ideal.',
    url: '#',
  },
};

export default function EntryExperience({ displayType, config, services, linkedServiceId, linkedServiceStatus, onDisplayTypeChange, onConfigChange, onServiceChange, onCreateService }: Props) {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleFocus = (field: string) => setFocusedField(field);
  const handleBlur = () => setTimeout(() => setFocusedField(null), 150);

  const selectedService = services.find(s => s.id === linkedServiceId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-1">Entry Experience</h2>
        <p className="text-sm text-gray-600">Configure how visitors first see your pricing widget</p>
      </div>

      <div className="pb-6 border-b border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Service Used for Pricing <span className="text-red-500">*</span>
        </label>
        {services.length === 0 ? (
          <div className="border-2 border-yellow-200 bg-yellow-50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-900 mb-1">No Services Available</p>
                <p className="text-sm text-yellow-700 mb-3">
                  You must create and publish a Service before activating a Widget.
                </p>
                <button
                  onClick={onCreateService}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium text-sm"
                >
                  Create Service
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <select
              value={linkedServiceId || ''}
              onChange={(e) => {
                const service = services.find(s => s.id === e.target.value);
                if (service) {
                  onServiceChange(service.id, service.name, service.status);
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select a service...</option>
              {services.map(service => (
                <option key={service.id} value={service.id}>
                  {service.name} ({service.status === 'live' ? 'Live' : 'Draft'})
                </option>
              ))}
            </select>
            {selectedService && (
              <div className="mt-2 flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  selectedService.status === 'live' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {selectedService.status === 'live' ? 'Live' : 'Draft'}
                </span>
                {selectedService.status === 'draft' && (
                  <p className="text-xs text-gray-500">This service must be published before the widget can go live</p>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Display Type</label>
        <div className="grid grid-cols-2 gap-3">
          {DISPLAY_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            return (
              <label
                key={opt.value}
                className={`flex items-center gap-3 p-3 md:p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  displayType === opt.value
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onFocus={() => handleFocus('displayType')}
                onBlur={handleBlur}
              >
                <input
                  type="radio"
                  name="displayType"
                  value={opt.value}
                  checked={displayType === opt.value}
                  onChange={() => onDisplayTypeChange(opt.value)}
                  className="sr-only"
                />
                <Icon className={`w-5 h-5 flex-shrink-0 ${displayType === opt.value ? 'text-green-600' : 'text-gray-400'}`} />
                <span className={`text-sm font-medium ${displayType === opt.value ? 'text-green-900' : 'text-gray-700'}`}>
                  {opt.label}
                </span>
              </label>
            );
          })}
        </div>
        {focusedField === 'displayType' && (
          <p className="text-xs text-gray-500 mt-2" style={{ animation: 'fadeIn 0.15s ease-out' }}>
            {MICROCOPY.displayType.text}{' '}
            <a href={MICROCOPY.displayType.url} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 font-medium">
              Learn more
            </a>
          </p>
        )}
      </div>

      <div className="space-y-4 pt-4 border-t border-gray-200">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Address Field Placeholder</label>
          <input
            type="text"
            value={config.addressPlaceholder}
            onChange={(e) => onConfigChange({ ...config, addressPlaceholder: e.target.value })}
            onFocus={() => handleFocus('addressPlaceholder')}
            onBlur={handleBlur}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          {focusedField === 'addressPlaceholder' && (
            <p className="text-xs text-gray-500 mt-1.5" style={{ animation: 'fadeIn 0.15s ease-out' }}>
              {MICROCOPY.addressPlaceholder.text}{' '}
              <a href={MICROCOPY.addressPlaceholder.url} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 font-medium">
                Learn more
              </a>
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
          <input
            type="text"
            value={config.buttonText}
            onChange={(e) => onConfigChange({ ...config, buttonText: e.target.value })}
            onFocus={() => handleFocus('buttonText')}
            onBlur={handleBlur}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          {focusedField === 'buttonText' && (
            <p className="text-xs text-gray-500 mt-1.5" style={{ animation: 'fadeIn 0.15s ease-out' }}>
              {MICROCOPY.buttonText.text}{' '}
              <a href={MICROCOPY.buttonText.url} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 font-medium">
                Learn more
              </a>
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Supporting Microcopy</label>
          <input
            type="text"
            value={config.supportingMicrocopy}
            onChange={(e) => onConfigChange({ ...config, supportingMicrocopy: e.target.value })}
            onFocus={() => handleFocus('supportingMicrocopy')}
            onBlur={handleBlur}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          {focusedField === 'supportingMicrocopy' && (
            <p className="text-xs text-gray-500 mt-1.5" style={{ animation: 'fadeIn 0.15s ease-out' }}>
              {MICROCOPY.supportingMicrocopy.text}{' '}
              <a href={MICROCOPY.supportingMicrocopy.url} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 font-medium">
                Learn more
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
