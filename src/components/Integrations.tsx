import { Check, X, ExternalLink } from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  connected: boolean;
  popular?: boolean;
}

export default function Integrations() {
  const integrations: Integration[] = [
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Accept deposits and payments directly through your quotes',
      category: 'Payments',
      connected: true,
      popular: true,
    },
    {
      id: 'quickbooks',
      name: 'QuickBooks',
      description: 'Automatically sync quotes and payments to your accounting',
      category: 'Accounting',
      connected: false,
      popular: true,
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Connect to 5,000+ apps with automated workflows',
      category: 'Automation',
      connected: false,
      popular: true,
    },
    {
      id: 'mailchimp',
      name: 'Mailchimp',
      description: 'Add new customers to email marketing campaigns',
      category: 'Marketing',
      connected: false,
    },
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      description: 'Sync accepted quotes to your calendar',
      category: 'Calendar',
      connected: false,
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Get notifications when new quotes are created or paid',
      category: 'Communication',
      connected: false,
    },
  ];

  const categories = ['All', 'Payments', 'Accounting', 'Automation', 'Marketing', 'Calendar', 'Communication'];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Integrations</h1>
        <p className="text-gray-600">Connect LawnPricing with your favorite tools</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
            <Check className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Accept Payments</h3>
          <p className="text-sm text-gray-600 mb-4">
            Connect Stripe to collect deposits and process payments instantly
          </p>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-gray-700 font-medium">Stripe Connected</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6">
          <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Sync Accounting</h3>
          <p className="text-sm text-gray-600 mb-4">
            Keep your books up to date by syncing quotes and payments automatically
          </p>
          <button className="text-sm text-green-700 hover:text-green-800 font-medium flex items-center gap-1">
            Connect QuickBooks
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-6">
          <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Automate Workflows</h3>
          <p className="text-sm text-gray-600 mb-4">
            Trigger actions in other apps when quotes are created or paid
          </p>
          <button className="text-sm text-purple-700 hover:text-purple-800 font-medium flex items-center gap-1">
            Connect Zapier
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Available Integrations</h2>
        </div>

        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {integrations.map((integration) => (
            <div key={integration.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">
                        {integration.name.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                        {integration.popular && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{integration.category}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 ml-13">
                    {integration.description}
                  </p>
                  {integration.connected && (
                    <div className="flex items-center gap-2 text-sm ml-13">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-green-700 font-medium">Connected</span>
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  {integration.connected ? (
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center gap-2">
                      <X className="w-4 h-4" />
                      Disconnect
                    </button>
                  ) : (
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                      Connect
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-2">Need a Custom Integration?</h3>
        <p className="text-sm text-gray-600 mb-4">
          Use our REST API to build custom integrations with your existing systems and workflows.
        </p>
        <button className="px-4 py-2 bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium flex items-center gap-2">
          View API Documentation
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
