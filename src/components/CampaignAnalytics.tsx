import { ArrowLeft, TrendingUp, Eye, FileText, DollarSign } from 'lucide-react';

interface CampaignAnalyticsProps {
  onBack: () => void;
}

export default function CampaignAnalytics({ onBack }: CampaignAnalyticsProps) {
  const metrics = [
    { label: 'QR Scans', value: '247', icon: Eye, change: '+12%', color: 'blue' },
    { label: 'Quotes Viewed', value: '189', icon: FileText, change: '+8%', color: 'green' },
    { label: 'Deposits Paid', value: '34', icon: DollarSign, change: '+5%', color: 'green' },
    { label: 'Conversion Rate', value: '13.8%', icon: TrendingUp, change: '+2.1%', color: 'green' },
  ];

  const funnelData = [
    { stage: 'QR Scans', count: 247, percentage: 100, color: 'bg-blue-500' },
    { stage: 'Quotes Viewed', count: 189, percentage: 76.5, color: 'bg-green-500' },
    { stage: 'Deposits Paid', count: 34, percentage: 13.8, color: 'bg-green-600' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 md:mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 font-medium text-sm md:text-base"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Campaigns
        </button>
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Spring Boost Campaign</h1>
        <p className="text-sm md:text-base text-gray-600">Performance analytics and insights</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center ${
                  metric.color === 'blue' ? 'bg-blue-100' : 'bg-green-100'
                }`}>
                  <Icon className={`w-4 h-4 md:w-5 md:h-5 ${
                    metric.color === 'blue' ? 'text-blue-600' : 'text-green-600'
                  }`} />
                </div>
                <span className="text-xs md:text-sm font-medium text-green-600">{metric.change}</span>
              </div>
              <p className="text-xs md:text-sm text-gray-600 mb-1">{metric.label}</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">{metric.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
          <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4 md:mb-6">Conversion Funnel</h2>

          <div className="space-y-4">
            {funnelData.map((stage, idx) => (
              <div key={stage.stage}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{stage.stage}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">{stage.count}</span>
                    <span className="text-sm text-gray-500">({stage.percentage.toFixed(1)}%)</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className={`${stage.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${stage.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Overall Conversion</span>
              <span className="text-lg font-bold text-green-600">13.8%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
          <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4 md:mb-6">Revenue Generated</h2>

          <div className="mb-4 md:mb-6">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl md:text-4xl font-bold text-gray-900">$5,780</span>
              <span className="text-base md:text-lg text-gray-500">total</span>
            </div>
            <p className="text-sm text-gray-600">From 34 deposits</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Average Deposit</p>
                <p className="text-xs text-gray-500">Per customer</p>
              </div>
              <p className="text-xl font-bold text-gray-900">$170</p>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Cost Per Acquisition</p>
                <p className="text-xs text-gray-500">Campaign cost / deposits</p>
              </div>
              <p className="text-xl font-bold text-gray-900">$5.37</p>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div>
                <p className="text-sm font-medium text-green-900">ROI</p>
                <p className="text-xs text-green-600">Return on investment</p>
              </div>
              <p className="text-xl font-bold text-green-700">+31.5x</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
        <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4 md:mb-6">Campaign Details</h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Addresses</p>
            <p className="text-2xl font-bold text-gray-900">350</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Distribution Date</p>
            <p className="text-lg font-semibold text-gray-900">Mar 10, 2024</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Campaign Status</p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Active
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Service Type</p>
            <p className="text-lg font-semibold text-gray-900">Lawn Mowing</p>
          </div>
        </div>
      </div>
    </div>
  );
}
