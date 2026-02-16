export type QuoteState = 'draft' | 'sent' | 'viewed' | 'accepted' | 'deposit_paid' | 'expired' | 'cancelled';

export function getStateColor(state: QuoteState): string {
  switch (state) {
    case 'draft': return 'bg-gray-100 text-gray-800';
    case 'sent': return 'bg-blue-100 text-blue-800';
    case 'viewed': return 'bg-cyan-100 text-cyan-800';
    case 'accepted': return 'bg-green-100 text-green-800';
    case 'deposit_paid': return 'bg-green-100 text-green-800';
    case 'expired': return 'bg-orange-100 text-orange-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
  }
}

export function getStateBorderColor(state: QuoteState): string {
  switch (state) {
    case 'draft': return 'border-gray-300';
    case 'sent': return 'border-gray-300';
    case 'viewed': return 'border-gray-300';
    case 'accepted': return 'border-blue-500';
    case 'deposit_paid': return 'border-green-500';
    case 'expired': return 'border-gray-400';
    case 'cancelled': return 'border-gray-400';
  }
}

export function getStateLabel(state: QuoteState): string {
  return state.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}
