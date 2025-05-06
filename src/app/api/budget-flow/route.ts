// src/app/api/budget-flow/route.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getFinancialAdvice, type FinancialAdviceInput } from '@/ai/flows/financial-advice-flow';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as FinancialAdviceInput;
    // Basic validation, can be expanded with Zod schema if needed here
    if (!body.financialData || !body.userContext) {
      return NextResponse.json({ error: 'Invalid input: financialData and userContext are required.' }, { status: 400 });
    }
    const result = await getFinancialAdvice(body);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in financial advice API route:', error);
    // Provide a generic error message to the client
    let errorMessage = 'Failed to process request.';
    if (error instanceof SyntaxError) {
      errorMessage = 'Invalid JSON payload.';
    } else if (error.message) {
      // In a real app, be careful about exposing internal error messages.
      // For now, let's keep it somewhat generic for client.
      // errorMessage = error.message; 
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
