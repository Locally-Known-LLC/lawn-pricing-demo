import { Plus, Trash2 } from 'lucide-react';

export interface Addon {
  name: string;
  priceType: 'flat' | 'per_sqft' | 'conditional';
  price: number;
  minSqft?: number;
}

interface Props {
  addons: Addon[];
  onAddonsChange: (addons: Addon[]) => void;
}

export default function ServiceAddOnsStep({ addons, onAddonsChange }: Props) {
  const handleAddonChange = (index: number, field: keyof Addon, value: string | number) => {
    const newAddons = [...addons];
    newAddons[index] = { ...newAddons[index], [field]: value };
    onAddonsChange(newAddons);
  };

  const handleAddAddon = () => {
    onAddonsChange([...addons, { name: '', price: 0, priceType: 'flat' }]);
  };

  const handleDeleteAddon = (index: number) => {
    onAddonsChange(addons.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Add-on Services</h2>
        <p className="text-gray-600">Optional extras customers can add to their quote</p>
      </div>

      <div className="space-y-4">
        {addons.map((addon, idx) => (
          <div key={idx} className="p-4 border border-gray-200 rounded-lg">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add-on Name
                  </label>
                  <input
                    type="text"
                    value={addon.name}
                    onChange={(e) => handleAddonChange(idx, 'name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Type
                  </label>
                  <select
                    value={addon.priceType}
                    onChange={(e) => handleAddonChange(idx, 'priceType', e.target.value as 'flat' | 'per_sqft' | 'conditional')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="flat">Flat Price</option>
                    <option value="per_sqft">Per SqFt</option>
                    <option value="conditional">Conditional</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {addon.priceType === 'per_sqft' ? 'Price per SqFt ($)' : 'Price ($)'}
                  </label>
                  <input
                    type="number"
                    step={addon.priceType === 'per_sqft' ? '0.001' : '1'}
                    value={addon.price}
                    onChange={(e) => handleAddonChange(idx, 'price', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {addon.priceType === 'conditional' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min SqFt Required
                    </label>
                    <input
                      type="number"
                      value={addon.minSqft || ''}
                      onChange={(e) => handleAddonChange(idx, 'minSqft', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="5000"
                    />
                  </div>
                )}
              </div>

              <button
                onClick={() => handleDeleteAddon(idx)}
                className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Remove Add-on
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleAddAddon}
        className="w-full px-4 py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-green-400 hover:text-green-600 transition-colors font-medium flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Another Add-on
      </button>
    </div>
  );
}
