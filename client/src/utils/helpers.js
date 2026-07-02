import { formatDistanceToNow, format, isValid, parseISO } from 'date-fns';

/**
 * Format a number as Indian Rupees currency.
 * @param {number} amount
 * @returns {string} e.g. ₹12,34,567
 */
export function formatCurrency(amount) {
  if (amount == null || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a date string nicely.
 * @param {string|Date} date
 * @returns {string} e.g. 'Jul 2, 2026, 6:30 PM'
 */
export function formatDate(date) {
  if (!date) return '';
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(parsed)) return '';
  return format(parsed, 'MMM d, yyyy, h:mm a');
}

/**
 * Format a date as relative time.
 * @param {string|Date} date
 * @returns {string} e.g. '2 minutes ago'
 */
export function formatRelativeTime(date) {
  if (!date) return '';
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(parsed)) return '';
  return formatDistanceToNow(parsed, { addSuffix: true });
}

/**
 * Get Tailwind CSS classes for auction status badge.
 * @param {string} status
 * @returns {string}
 */
export function getStatusColor(status) {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case 'upcoming':
      return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'ended':
      return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    default:
      return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  }
}

/**
 * Get human-readable status label.
 * @param {string} status
 * @returns {string}
 */
export function getStatusLabel(status) {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'Live Now';
    case 'upcoming':
      return 'Upcoming';
    case 'ended':
      return 'Ended';
    default:
      return status || 'Unknown';
  }
}
