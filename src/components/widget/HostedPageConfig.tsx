import { useState, useEffect } from 'react';
import { Copy, Check, AlertCircle, CheckCircle2, MapPin } from 'lucide-react';
import type { HostedPageConfig, StylingConfig, EntryConfig } from './types';

interface Props {
  config: HostedPageConfig;
  linkedServiceId: string | null;
  linkedServiceStatus: 'draft' | 'live' | null;
  linkedServiceName: string | null;
  stylingConfig: StylingConfig;
  entryConfig: EntryConfig;
  variantStatus: 'draft' | 'live';
  onChange: (config: HostedPageConfig) => void;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 40);
}

export default function HostedPageConfig({
  config,
  linkedServiceId,
  linkedServiceStatus,
  linkedServiceName,
  stylingConfig,
  entryConfig,
  variantStatus,
  onChange,
}: Props) {
  const [slugCopied, setSlugCopied] = useState(false);
  const [slugInput, setSlugInput] = useState(config.slug);

  useEffect(() => {
    setSlugInput(config.slug);
  }, [config.slug]);

  const fullUrl = `lawnpricing.com/${slugInput || 'your-page'}`;

  const handleSlugChange = (raw: string) => {
    const clean = raw.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 40);
    setSlugInput(clean);
    onChange({ ...config, slug: clean });
  };

  const handleCompanyNameChange = (value: string) => {
    const newSlug = config.slug === '' || config.slug === slugify(config.companyName)
      ? slugify(value)
      : config.slug;
    setSlugInput(newSlug);
    onChange({ ...config, companyName: value, slug: newSlug });
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(`https://${fullUrl}`);
    setSlugCopied(true);
    setTimeout(() => setSlugCopied(false), 2000);
  };

  const canPublishHosted = !!linkedServiceId && linkedServiceStatus === 'live';

  const publishBlockReason = !linkedServiceId
    ? 'A linked service is required before the hosted page can go live.'
    : linkedServiceStatus !== 'live'
    ? `The linked service "${linkedServiceName}" must be published before the hosted page can go live.`
    : null;

  const handleToggleLive = () => {
    if (!canPublishHosted) return;
    onChange({ ...config, hostedPageLive: !config.hostedPageLive });
  };

  const btnRadius = `${stylingConfig.borderRadius}px`;
  const btnBg = stylingConfig.primaryColor;

  return (
    <div className="space-y-6 pt-6 border-t border-gray-200">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Hosted Page</h3>
        <p className="text-xs text-gray-500">A standalone public URL — no website required.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
          <input
            type="text"
            value={config.companyName}
            onChange={(e) => handleCompanyNameChange(e.target.value)}
            placeholder="Green Lawn Co."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Public Page URL</label>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-green-500 focus-within:border-transparent">
            <span className="px-3 py-2 bg-gray-50 text-sm text-gray-500 border-r border-gray-300 whitespace-nowrap select-none">
              lawnpricing.com/
            </span>
            <input
              type="text"
              value={slugInput}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="your-company"
              className="flex-1 px-3 py-2 text-sm text-gray-900 focus:outline-none min-w-0"
            />
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-xs text-gray-400 font-mono truncate">https://{fullUrl}</span>
            <button
              onClick={handleCopyUrl}
              className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 font-medium ml-2 flex-shrink-0 transition-colors"
            >
              {slugCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {slugCopied ? 'Copied' : 'Copy Link'}
            </button>
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
          </div>
          <span className="text-xs text-gray-400 font-mono truncate">https://{fullUrl}</span>
        </div>

        <div className="px-6 py-8 space-y-6 bg-white">
          <div className="flex flex-col items-center gap-2 text-center">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold"
              style={{ backgroundColor: btnBg }}
            >
              {(config.companyName || 'L').charAt(0).toUpperCase()}
            </div>
            <p className="text-sm font-semibold text-gray-900">
              {config.companyName || 'Your Company'}
            </p>
          </div>

          <div className="text-center space-y-1">
            <h2 className="text-lg font-bold text-gray-900 leading-tight">
              {entryConfig.buttonText === 'Get Your Quote' || !entryConfig.buttonText
                ? 'Get an instant lawn care quote'
                : entryConfig.buttonText}
            </h2>
            <p className="text-sm text-gray-500">{entryConfig.supportingMicrocopy}</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <div className="px-3 py-2.5 bg-gray-50 border-r border-gray-200">
                <MapPin className="w-4 h-4 text-gray-400" />
              </div>
              <span className="px-3 py-2.5 text-sm text-gray-400 flex-1">
                {entryConfig.addressPlaceholder}
              </span>
            </div>
            <button
              className="w-full py-2.5 text-sm font-semibold text-white transition-colors"
              style={{
                backgroundColor: stylingConfig.buttonStyle === 'outline' ? 'transparent' : btnBg,
                color: stylingConfig.buttonStyle === 'outline' ? btnBg : 'white',
                border: stylingConfig.buttonStyle === 'outline' ? `2px solid ${btnBg}` : 'none',
                borderRadius: btnRadius,
              }}
            >
              {entryConfig.buttonText}
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
      </div>

      {publishBlockReason && (
        <div className="flex items-start gap-2.5 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-yellow-800">{publishBlockReason}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {config.hostedPageLive ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">Hosted Page Live</span>
            </>
          ) : (
            <span className="text-sm text-gray-500">Page not yet published</span>
          )}
        </div>
        <button
          onClick={handleToggleLive}
          disabled={!canPublishHosted}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
            config.hostedPageLive
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {config.hostedPageLive ? 'Take Offline' : 'Publish Hosted Page'}
        </button>
      </div>
    </div>
  );
}
