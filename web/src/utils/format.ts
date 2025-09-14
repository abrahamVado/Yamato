/**
 * Common formatting helpers used throughout the application.
 * These functions wrap the native Intl API to format numbers,
 * currencies and dates in a locale-aware manner.
 */

/**
 * Formats a numeric value as a currency string.
 *
 * @param value The numeric value to format.
 * @param currency The ISO 4217 currency code (default: USD).
 * @param locale The BCP 47 locale string (default: en-US).
 */
export function formatCurrency(value: number, currency: string = 'USD', locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Formats a Date instance as a localized date string.
 *
 * @param date The date to format.
 * @param locale The BCP 47 locale string (default: en-US).
 * @param options Additional Intl.DateTimeFormat options.
 */
export function formatDate(date: Date, locale: string = 'en-US', options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(locale, options).format(date);
}

/**
 * Formats a number as a percentage string with an optional number of
 * decimal places.
 *
 * @param value The numeric percentage (e.g. 0.25 for 25%).
 * @param digits The number of decimal places to display (default: 0).
 */
export function formatPercentage(value: number, digits: number = 0): string {
  return `${(value * 100).toFixed(digits)}%`;
}