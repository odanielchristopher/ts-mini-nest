import { z } from 'zod';

export const createAccountSchema = z.object({
  name: z.string().nonempty('Name is required.'),
  email: z.string().email('E-mail invalid.').nonempty('E-mail is required.'),
});

export type CreateAccountDto = z.infer<typeof createAccountSchema>;
