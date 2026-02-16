import { CheckCircle2 } from 'lucide-react';

interface Props {
  depositEnabled: boolean;
  depositAmount: number;
  onDepositEnabledChange: (enabled: boolean) => void;
  onDepositAmountChange: (amount: number) => void;
}

export default function ServiceDepositPublishStep({
  depositEnabled,
  depositAmount,
  onDepositEnabledChange,
  onDepositAmountChange,
}: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Deposit & Publishing</h2>
        <p className="text-gray-600">Configure payment terms and publish your service</p>
      </div>

      <div>
        <label className="flex items-center gap-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
          <input
            type="checkbox"
            checked={depositEnabled}
            onChange={(e) => onDepositEnabledChange(e.target.checked)}
            className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
          />
          <div>
            <p className="font-medium text-gray-900">Require Deposit</p>
            <p className="text-sm text-gray-500">Customers must pay a deposit to accept the quote</p>
          </div>
        </label>
      </div>

      {depositEnabled && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deposit Amount
          </label>
          <div className="flex items-center gap-4">
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => onDepositAmountChange(parseInt(e.target.value) || 0)}
              className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <span className="text-gray-600">or</span>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
              <option>Fixed amount</option>
              <option>Percentage</option>
            </select>
          </div>
        </div>
      )}

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <p className="font-medium text-green-900 mb-1">Ready to Publish</p>
            <p className="text-sm text-green-700">
              Your service is configured and ready to go live. Customers will be able to get instant quotes using your pricing engine.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
