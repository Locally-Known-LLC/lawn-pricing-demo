interface Plan {
  name: string;
  price: number;
  frequency: string;
}

interface Props {
  plans: Plan[];
  onPlansChange: (plans: Plan[]) => void;
}

export default function ServicePlansStep({ plans, onPlansChange }: Props) {
  const handlePlanChange = (index: number, field: keyof Plan, value: string | number) => {
    const newPlans = [...plans];
    newPlans[index] = { ...newPlans[index], [field]: value };
    onPlansChange(newPlans);
  };

  const handleAddPlan = () => {
    onPlansChange([...plans, { name: '', price: 0, frequency: 'Weekly' }]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Plans</h2>
        <p className="text-gray-600">Create different pricing tiers for your customers</p>
      </div>

      <div className="space-y-4">
        {plans.map((plan, idx) => (
          <div key={idx} className="p-4 border border-gray-200 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plan Name
                </label>
                <input
                  type="text"
                  value={plan.name}
                  onChange={(e) => handlePlanChange(idx, 'name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Base Price
                </label>
                <input
                  type="number"
                  value={plan.price}
                  onChange={(e) => handlePlanChange(idx, 'price', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequency
                </label>
                <select
                  value={plan.frequency}
                  onChange={(e) => handlePlanChange(idx, 'frequency', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option>Weekly</option>
                  <option>Bi-weekly</option>
                  <option>Monthly</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleAddPlan}
        className="w-full px-4 py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-green-400 hover:text-green-600 transition-colors font-medium"
      >
        + Add Another Plan
      </button>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          Plans will be automatically adjusted based on property size using your pricing engine
        </p>
      </div>
    </div>
  );
}
