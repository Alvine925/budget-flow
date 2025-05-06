/**
 * Represents the tax parameters.
 */
export interface TaxParameters {
  income: number;
  taxRate: number;
}

/**
 * Represents the tax amount.
 */
export interface TaxAmount {
  tax: number;
}

/**
 * Asynchronously retrieves the tax amount for the parameters entered.
 *
 * @param taxParameters The income and tax rate.
 * @returns A promise that resolves to a TaxAmount object containing the tax amount.
 */
export async function getTaxAmount(taxParameters: TaxParameters): Promise<TaxAmount> {
  // TODO: Implement this by calling an API.

  return {
    tax: 12000
  };
}
