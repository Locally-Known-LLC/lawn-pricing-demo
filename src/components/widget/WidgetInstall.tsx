import { useState } from 'react';
import { Copy, Check, Globe, Code, Puzzle, LayoutTemplate } from 'lucide-react';
import type { InstallPlatform, HostedPageConfig, StylingConfig, EntryConfig } from './types';
import HostedPageConfig from './HostedPageConfig';

interface Props {
  variantId: string;
  variantName: string;
  platform: InstallPlatform | null;
  onPlatformChange: (platform: InstallPlatform) => void;
  hostedPageConfig: HostedPageConfig | null;
  linkedServiceId: string | null;
  linkedServiceStatus: 'draft' | 'live' | null;
  linkedServiceName: string | null;
  stylingConfig: StylingConfig;
  entryConfig: EntryConfig;
  variantStatus: 'draft' | 'live';
  onHostedPageConfigChange: (config: HostedPageConfig) => void;
}

const PLATFORMS: { value: InstallPlatform; label: string; icon: typeof Globe; description: string }[] = [
  { value: 'wordpress', label: 'WordPress', icon: Globe, description: 'Plugin or shortcode' },
  { value: 'wix', label: 'Wix', icon: Globe, description: 'Embed HTML element' },
  { value: 'webflow', label: 'Webflow', icon: Globe, description: 'Embed component' },
  { value: 'custom', label: 'Custom / Other', icon: Code, description: 'Script tag embed' },
  { value: 'hosted', label: 'Hosted Page', icon: LayoutTemplate, description: 'No website required' },
];

export default function WidgetInstall({
  variantId,
  variantName,
  platform,
  onPlatformChange,
  hostedPageConfig,
  linkedServiceId,
  linkedServiceStatus,
  linkedServiceName,
  stylingConfig,
  entryConfig,
  variantStatus,
  onHostedPageConfigChange,
}: Props) {
  const [copied, setCopied] = useState(false);

  const embedSnippet = `<script src="https://cdn.lawnpricing.com/widget.js"></script>
<div
  data-lawnpricing-widget="${variantId}"
  data-variant="${variantName.toLowerCase().replace(/\s+/g, '-')}"
></div>`;

  const shortcode = `[lawnpricing_widget id="${variantId}"]`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const defaultHostedConfig = (): HostedPageConfig => ({
    slug: variantName.toLowerCase().replace(/\s+/g, '-'),
    companyName: '',
    hostedPageLive: false,
  });

  const handlePlatformChange = (p: InstallPlatform) => {
    onPlatformChange(p);
    if (p === 'hosted' && !hostedPageConfig) {
      onHostedPageConfigChange(defaultHostedConfig());
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-1">Install</h2>
        <p className="text-sm text-gray-600">Choose how to deploy this widget</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Deployment Method</label>
        <div className="grid grid-cols-2 gap-3">
          {PLATFORMS.map((p) => {
            const Icon = p.icon;
            const isHosted = p.value === 'hosted';
            return (
              <label
                key={p.value}
                className={`flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                  isHosted ? 'col-span-2' : ''
                } ${
                  platform === p.value
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="platform"
                  value={p.value}
                  checked={platform === p.value}
                  onChange={() => handlePlatformChange(p.value)}
                  className="sr-only"
                />
                <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${platform === p.value ? 'text-green-600' : 'text-gray-400'}`} />
                <div>
                  <span className={`text-sm font-medium block ${platform === p.value ? 'text-green-900' : 'text-gray-900'}`}>
                    {p.label}
                  </span>
                  <span className="text-xs text-gray-500">{p.description}</span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {platform === 'hosted' && hostedPageConfig && (
        <HostedPageConfig
          config={hostedPageConfig}
          linkedServiceId={linkedServiceId}
          linkedServiceStatus={linkedServiceStatus}
          linkedServiceName={linkedServiceName}
          stylingConfig={stylingConfig}
          entryConfig={entryConfig}
          variantStatus={variantStatus}
          onChange={onHostedPageConfigChange}
        />
      )}

      {platform && platform !== 'hosted' && (
        <div className="pt-4 border-t border-gray-200 space-y-4">
          {platform === 'wordpress' && (
            <>
              <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
                <h3 className="text-sm font-semibold text-gray-900">Option 1: WordPress Plugin</h3>
                <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                  <li>Install the LawnPricing plugin from the WordPress directory</li>
                  <li>Navigate to Settings &gt; LawnPricing in your admin panel</li>
                  <li>Enter your API key in the plugin settings</li>
                  <li>Use the widget block or shortcode to place it</li>
                </ol>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                <h3 className="text-sm font-semibold text-gray-900">Option 2: Shortcode</h3>
                <div className="bg-gray-900 rounded-lg p-3 flex items-center justify-between">
                  <code className="text-sm text-green-400 font-mono">{shortcode}</code>
                  <button
                    onClick={() => handleCopy(shortcode)}
                    className="text-gray-400 hover:text-white transition-colors ml-3 flex-shrink-0"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500">Paste this shortcode into any page or post</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value="lp_live_xxxxxxxxxxxxxxxxxxxx"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm text-gray-600"
                  />
                  <button
                    onClick={() => handleCopy('lp_live_xxxxxxxxxxxxxxxxxxxx')}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-600" />}
                  </button>
                </div>
              </div>
            </>
          )}

          {(platform === 'wix' || platform === 'webflow') && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
              <h3 className="text-sm font-semibold text-gray-900">
                {platform === 'wix' ? 'Wix' : 'Webflow'} Installation
              </h3>
              <ol className="text-sm text-gray-600 space-y-3 list-decimal list-inside">
                {platform === 'wix' ? (
                  <>
                    <li>Open your Wix site editor</li>
                    <li>Add an "Embed HTML" element to your page</li>
                    <li>Paste the embed code below into the HTML field</li>
                    <li>Resize and position the element as needed</li>
                  </>
                ) : (
                  <>
                    <li>Open your Webflow project designer</li>
                    <li>Add an "Embed" element where you want the widget</li>
                    <li>Paste the embed code below into the code field</li>
                    <li>Publish your site to see the widget live</li>
                  </>
                )}
              </ol>
            </div>
          )}

          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Embed Code</h3>
              <button
                onClick={() => handleCopy(embedSnippet)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm text-green-400 font-mono whitespace-pre">
                <code>{embedSnippet}</code>
              </pre>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Puzzle className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700">Need help installing?</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Request white-glove installation and our team will set it up for you.
                </p>
                <button className="text-xs text-green-600 hover:text-green-700 font-medium mt-2">
                  Request Installation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
