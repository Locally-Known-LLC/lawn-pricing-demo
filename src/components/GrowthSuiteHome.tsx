import { Plus, Eye, Edit } from 'lucide-react';

interface GrowthSuiteHomeProps {
  onCreateCampaign: () => void;
  onViewCampaign: (id: string) => void;
}

export default function GrowthSuiteHome({ onCreateCampaign, onViewCampaign }: GrowthSuiteHomeProps) {
  const campaigns = [
    { id: '1', name: 'Spring Boost', addresses: 350, status: 'Completed', statusColor: 'green', created: 'Mar 10', action: 'View', actionIcon: Eye },
    { id: '2', name: 'New Subdivision', addresses: 120, status: 'Draft', statusColor: 'gray', created: 'Mar 18', action: 'Edit', actionIcon: Edit },
    { id: '3', name: 'Fall Cleanup', addresses: 800, status: 'Printing', statusColor: 'blue', created: 'Mar 22', action: 'View', actionIcon: Eye },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Neighborhood Campaigns</h1>
        <p className="text-sm md:text-base text-gray-600">Create and manage door-to-door marketing campaigns</p>
      </div>

      <div className="mb-4 md:mb-6">
        <button
          onClick={onCreateCampaign}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 md:py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm md:text-base"
        >
          <Plus className="w-5 h-5" />
          Create New Campaign
        </button>
      </div>

      <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campaign Name
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Addresses
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {campaigns.map((campaign) => {
                const ActionIcon = campaign.actionIcon;
                return (
                  <tr key={campaign.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{campaign.addresses}</div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        campaign.statusColor === 'green' ? 'bg-green-100 text-green-800' :
                        campaign.statusColor === 'blue' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {campaign.created}
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => onViewCampaign(campaign.id)}
                        className="inline-flex items-center gap-1.5 text-sm text-green-600 hover:text-green-700 font-medium"
                      >
                        <ActionIcon className="w-4 h-4" />
                        {campaign.action}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden space-y-3">
        {campaigns.map((campaign) => {
          const ActionIcon = campaign.actionIcon;
          return (
            <div
              key={campaign.id}
              onClick={() => onViewCampaign(campaign.id)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 active:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 mb-1">{campaign.name}</h3>
                  <p className="text-sm text-gray-600">{campaign.addresses} addresses</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                  campaign.statusColor === 'green' ? 'bg-green-100 text-green-800' :
                  campaign.statusColor === 'blue' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {campaign.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{campaign.created}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewCampaign(campaign.id);
                  }}
                  className="inline-flex items-center gap-1.5 text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  <ActionIcon className="w-4 h-4" />
                  {campaign.action}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
