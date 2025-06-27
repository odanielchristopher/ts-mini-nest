import { z } from 'zod';

export const createAccountSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().nonempty(),
});

export type CreateAccountDto = z.infer<typeof createAccountSchema>;
