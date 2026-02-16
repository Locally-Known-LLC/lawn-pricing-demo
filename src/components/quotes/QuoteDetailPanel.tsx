import { X, Send, Eye, CheckCircle2, DollarSign, Clock, Ban } from 'lucide-react';
import { Quote } from './QuoteRow';
import { formatSquareFeet } from '../../utils/quoteFormat';

interface Props {
  quote: Quote | null;
  onClose: () => void;
}

function renderStateTimeline(quote: Quote) {
  const states = [
    { key: 'sent', label: 'Sent', timestamp: quote.sentAt, icon: Send },
    { key: 'viewed', label: 'Viewed', timestamp: quote.viewedAt, icon: Eye },
    { key: 'accepted', label: 'Accepted', timestamp: quote.acceptedAt, icon: CheckCircle2 },
    ...(quote.depositRequired ? [{ key: 'deposit_paid', label: 'Deposit Paid', timestamp: quote.depositPaidAt, icon: DollarSign }] : []),
  ];

  const terminalState = quote.state === 'expired' || quote.state === 'cancelled';

  return (
    <div className="space-y-3">
      {states.map((state) => {
        const Icon = state.icon;
        const isComplete = !!state.timestamp;
        const isCurrent = quote.state === state.key;

        return (
          <div key={state.key} className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              isComplete ? 'bg-green-100 text-green-600' :
              isCurrent ? 'bg-blue-100 text-blue-600' :
              'bg-gray-100 text-gray-400'
            }`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 pt-0.5">
              <p className={`text-sm font-medium ${isComplete || isCurrent ? 'text-gray-900' : 'text-gray-500'}`}>
                {state.label}
              </p>
              {state.timestamp && (
                <p className="text-xs text-gray-500">{state.timestamp}</p>
              )}
            </div>
          </div>
        );
      })}

      {terminalState && (
        <div className="flex items-start gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            quote.state === 'expired' ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'
          }`}>
            {quote.state === 'expired' ? <Clock className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
          </div>
          <div className="flex-1 pt-0.5">
            <p className="text-sm font-medium text-gray-900">
              {quote.state === 'expired' ? 'Expired' : 'Cancelled'}
            </p>
            {(quote.expiredAt || quote.cancelledAt) && (
              <p className="text-xs text-gray-500">{quote.expiredAt || quote.cancelledAt}</p>
            )}
          </div>
        </div>
      )}

      {quote.expiresOn && !terminalState && quote.state !== 'deposit_paid' && quote.state !== 'accepted' && (
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-xs text-amber-800">
            <strong>Expires:</strong> {quote.expiresOn}
          </p>
        </div>
      )}
    </div>
  );
}

export default function QuoteDetailPanel({ quote, onClose }: Props) {
  if (!quote) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40"
        onClick={onClose}
      />

      <div className="hidden md:block fixed inset-y-0 right-0 w-96 bg-white shadow-xl z-50 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Quote Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 -m-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-500 mb-3">Quote Status</p>
              {renderStateTimeline(quote)}
            </div>

            <div className="pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Customer</p>
              <p className="text-base font-medium text-gray-900">{quote.customer}</p>
              <p className="text-sm text-gray-600">{quote.email}</p>
              <p className="text-sm text-gray-600">{quote.phone}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Property Address</p>
              <p className="text-base font-medium text-gray-900">{quote.address}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Lawn Size</p>
              <p className="text-base font-medium text-gray-900">{formatSquareFeet(quote.lawnsqft)}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Service Type</p>
              <p className="text-base font-medium text-gray-900">{quote.service}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">Pricing</p>
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Calculated</span>
                  <span className="font-medium text-gray-900">${quote.calculatedAmount}</span>
                </div>
                {quote.overrideAmount && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Override</span>
                      <span className="font-medium text-amber-600">${quote.overrideAmount}</span>
                    </div>
                    {quote.overrideReason && (
                      <div className="pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-500">Reason: {quote.overrideReason}</p>
                      </div>
                    )}
                  </>
                )}
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Final Amount</span>
                    <span className="text-xl font-bold text-gray-900">${quote.finalAmount}</span>
                  </div>
                </div>
              </div>
            </div>

            {quote.depositRequired && quote.depositAmount && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Deposit Required</p>
                <p className="text-base font-medium text-gray-900">${quote.depositAmount}</p>
              </div>
            )}

            <div className="pt-6 border-t border-gray-200 space-y-3">
              {quote.state === 'sent' || quote.state === 'viewed' ? (
                <>
                  <button className="w-full px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                    Send Reminder
                  </button>
                  <button className="w-full px-4 py-2.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium">
                    Cancel Quote
                  </button>
                </>
              ) : null}
              <button className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                View Customer Portal
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden fixed inset-x-0 bottom-0 bg-white rounded-t-2xl shadow-xl z-50 max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3">
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-3" />
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Quote Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 -m-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-5">
          <div>
            <p className="text-sm text-gray-500 mb-3">Quote Status</p>
            {renderStateTimeline(quote)}
          </div>

          <div className="pt-5 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Customer</p>
            <p className="text-base font-medium text-gray-900">{quote.customer}</p>
            <p className="text-sm text-gray-600">{quote.email}</p>
            <p className="text-sm text-gray-600">{quote.phone}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Property Address</p>
            <p className="text-base font-medium text-gray-900">{quote.address}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Lawn Size</p>
            <p className="text-base font-medium text-gray-900">{formatSquareFeet(quote.lawnsqft)}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Service Type</p>
            <p className="text-base font-medium text-gray-900">{quote.service}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-2">Pricing</p>
            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Calculated</span>
                <span className="font-medium text-gray-900">${quote.calculatedAmount}</span>
              </div>
              {quote.overrideAmount && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Override</span>
                    <span className="font-medium text-amber-600">${quote.overrideAmount}</span>
                  </div>
                  {quote.overrideReason && (
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-500">Reason: {quote.overrideReason}</p>
                    </div>
                  )}
                </>
              )}
              <div className="pt-2 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Final Amount</span>
                  <span className="text-xl font-bold text-gray-900">${quote.finalAmount}</span>
                </div>
              </div>
            </div>
          </div>

          {quote.depositRequired && quote.depositAmount && (
            <div>
              <p className="text-sm text-gray-500 mb-1">Deposit Required</p>
              <p className="text-base font-medium text-gray-900">${quote.depositAmount}</p>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 space-y-3">
          {quote.state === 'sent' || quote.state === 'viewed' ? (
            <>
              <button className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 active:bg-green-800 transition-colors font-medium">
                Send Reminder
              </button>
              <button className="w-full px-4 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 active:bg-red-100 transition-colors font-medium">
                Cancel Quote
              </button>
            </>
          ) : null}
          <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors font-medium">
            View Customer Portal
          </button>
        </div>
      </div>
    </>
  );
}
