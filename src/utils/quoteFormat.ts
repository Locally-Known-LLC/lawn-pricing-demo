export function formatCurrency(amount: number): string {
  return `$${amount}`;
}

export function formatSquareFeet(sqft: number): string {
  return `${sqft.toLocaleString()} sq ft`;
}
