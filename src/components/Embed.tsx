import { Copy, Check, Eye } from 'lucide-react';
import { useState } from 'react';

export default function Embed() {
  const [copied, setCopied] = useState(false);
  const [showBranding, setShowBranding] = useState(true);
  const [buttonColor, setButtonColor] = useState('#16a34a');
  const [buttonText, setButtonText] = useState('Get Your Quote');

  const embedCode = `<script src="https://lawnpricing.com/embed.js"></script>
<div
  data-lawnpricing-widget
  data-color="${buttonColor}"
  data-text="${buttonText}"
  data-branding="${showBranding}"
></div>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Embed Widget</h1>
        <p className="text-gray-600">Add instant quoting to your website</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Widget Configuration</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Button Text
                </label>
                <input
                  type="text"
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Customize the call-to-action text for your button
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Button Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={buttonColor}
                    onChange={(e) => setButtonColor(e.target.value)}
                    className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={buttonColor}
                    onChange={(e) => setButtonColor(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Match your brand colors for a seamless experience
                </p>
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={showBranding}
                    onChange={(e) => setShowBranding(e.target.checked)}
                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Show LawnPricing Branding</p>
                    <p className="text-sm text-gray-500">Display "Powered by LawnPricing" badge</p>
                  </div>
                </label>
                <p className="text-sm text-gray-500 mt-1">
                  Remove branding on Pro plan to maintain full control of your customer experience
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Embed Code</h2>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-green-600 hover:text-green-700 font-medium"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Code
                  </>
                )}
              </button>
            </div>

            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm text-green-400 font-mono">
                <code>{embedCode}</code>
              </pre>
            </div>

            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 mb-2 font-medium">Installation Instructions:</p>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Copy the code snippet above</li>
                <li>Paste it anywhere in your website's HTML</li>
                <li>The widget will automatically appear and work instantly</li>
              </ol>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Features</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Instant Address Detection</p>
                  <p className="text-sm text-gray-600">Automatically measures lawn size from any address</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Real-time Pricing</p>
                  <p className="text-sm text-gray-600">Shows accurate quotes based on your pricing engine</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Mobile Optimized</p>
                  <p className="text-sm text-gray-600">Perfect experience on all devices</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Instant Deposits</p>
                  <p className="text-sm text-gray-600">Customers can pay deposits right from the widget</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Live Preview</h2>
              <Eye className="w-5 h-5 text-gray-400" />
            </div>

            <div className="aspect-[9/16] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-gray-200 p-6 overflow-y-auto">
              <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Professional Lawn Care
                </h3>
                <p className="text-gray-600 mb-6">
                  Get an instant quote for your property with our automated pricing system.
                </p>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Address
                    </label>
                    <input
                      type="text"
                      placeholder="123 Main St"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <button
                  style={{ backgroundColor: buttonColor }}
                  className="w-full py-3 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  {buttonText}
                </button>

                {showBranding && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-center text-gray-500">
                      Powered by <span className="font-medium text-green-600">LawnPricing</span>
                    </p>
                  </div>
                )}
              </div>

              <div className="text-center text-xs text-gray-500 mt-4">
                This is a live preview of your widget
              </div>
            </div>

            <div className="mt-4 bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">
                <strong>Note:</strong> Changes to configuration update instantly. Your widget automatically stays in sync with your pricing engine settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
