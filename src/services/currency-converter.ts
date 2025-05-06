/**
 * Represents the currencies to convert between.
 */
export interface Currencies {
  from: string;
  to: string;
}

/**
 * Represents the conversion rate for currencies.
 */
export interface ConversionRate {
  rate: number;
}

/**
 * Asynchronously retrieves the conversion rate for the currencies entered.
 *
 * @param currencies The currencies to convert between.
 * @returns A promise that resolves to a ConversionRate object containing the rate.
 */
export async function getConversionRate(currencies: Currencies): Promise<ConversionRate> {
  // TODO: Implement this by calling an API.

  return {
    rate: 1.2
  };
}
