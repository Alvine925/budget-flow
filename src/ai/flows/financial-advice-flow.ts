'use server';
/**
 * @fileOverview A BudgetFlow AI agent for providing financial advice.
 *
 * - getFinancialAdvice - A function that handles the financial advice generation.
 * - FinancialAdviceInput - The input type for the getFinancialAdvice function.
 * - FinancialAdviceOutput - The return type for the getFinancialAdvice function.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FinancialAdviceInputSchema = z.object({
  financialData: z.object({
    income: z.number().describe('Total monthly income.'),
    expenses: z.number().describe('Total monthly expenses.'),
    assets: z.number().describe('Total value of assets.'),
    liabilities: z.number().describe('Total value of liabilities.'),
    savingsGoal: z.number().optional().describe('Monthly savings goal.'),
  }),
  userContext: z
    .string()
    .describe(
      'Additional context about the user situation or specific questions.'
    ),
});

export type FinancialAdviceInput = z.infer<typeof FinancialAdviceInputSchema>;

const FinancialAdviceOutputSchema = z.object({
  advice: z.string().describe('Personalized financial advice.'),
  actionableSteps: z
    .array(z.string())
    .describe('A list of actionable steps the user can take.'),
  warnings: z
    .array(z.string())
    .optional()
    .describe('Potential financial risks or areas of concern.'),
});
export type FinancialAdviceOutput = z.infer<typeof FinancialAdviceOutputSchema>;

export async function getFinancialAdvice(
  input: FinancialAdviceInput
): Promise<FinancialAdviceOutput> {
  return financialAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'financialAdvicePrompt',
  input: {schema: FinancialAdviceInputSchema},
  output: {schema: FinancialAdviceOutputSchema},
  prompt: `You are a friendly and helpful financial advisor AI for an application called BudgetFlow. Your goal is to provide personalized, actionable financial advice.

User's Financial Data:
- Monthly Income: \${{{financialData.income}}}
- Monthly Expenses: \${{{financialData.expenses}}}
- Total Assets: \${{{financialData.assets}}}
- Total Liabilities: \${{{financialData.liabilities}}}
{{#if financialData.savingsGoal}}
- Monthly Savings Goal: \${{{financialData.savingsGoal}}}
{{/if}}

User's Context/Question:
{{{userContext}}}

Based on this information, provide:
1.  Personalized financial advice.
2.  A list of actionable steps (2-5 steps).
3.  Any potential warnings or areas of concern if applicable (0-3 warnings).

Focus on practical advice that the user can implement. Be encouraging and supportive.
If the user asks for specific investment advice, politely decline and state that you cannot provide investment recommendations but can offer general financial planning guidance.
If the user asks for tax advice, politely decline and state that you cannot provide tax recommendations but can offer general financial planning guidance.
Do not recommend any specific financial products or services.
Keep your response concise and easy to understand.
Output the response in the specified JSON format.
`,
});

const financialAdviceFlow = ai.defineFlow(
  {
    name: 'financialAdviceFlow',
    inputSchema: FinancialAdviceInputSchema,
    outputSchema: FinancialAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate financial advice.');
    }
    return output;
  }
);
