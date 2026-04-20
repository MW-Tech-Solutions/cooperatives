
'use server';
/**
 * @fileOverview A flow to simulate sending emails to guarantors for loan approval.
 * 
 * - sendGuarantorRequest - Simulates the email notification process.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GuarantorRequestInputSchema = z.object({
  memberName: z.string(),
  guarantorName: z.string(),
  guarantorEmail: z.string(),
  loanAmount: z.number(),
  systemName: z.string(),
});

const GuarantorRequestOutputSchema = z.object({
  success: z.boolean(),
  messageId: z.string(),
  simulationLog: z.string(),
});

export async function sendGuarantorRequest(input: z.infer<typeof GuarantorRequestInputSchema>) {
  return guarantorNotificationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'guarantorNotificationPrompt',
  input: { schema: GuarantorRequestInputSchema },
  output: { schema: GuarantorRequestOutputSchema },
  prompt: `You are the automated email system for {{{systemName}}}.
  
A member, {{{memberName}}}, has requested a loan of ₦{{{loanAmount}}} and nominated {{{guarantorName}}} as a guarantor.

Generate a professional email body for {{{guarantorEmail}}}. 
Return a simulated success response with a unique message ID and the email log.`,
});

const guarantorNotificationFlow = ai.defineFlow(
  {
    name: 'guarantorNotificationFlow',
    inputSchema: GuarantorRequestInputSchema,
    outputSchema: GuarantorRequestOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
