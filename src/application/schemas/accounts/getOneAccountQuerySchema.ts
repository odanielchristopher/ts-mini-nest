import { z } from 'zod';

export const getOneAccountQuerySchema = z.object({
  accountId: z.string().nonempty(),
});

export type GetOneAccountQuery = z.infer<typeof getOneAccountQuerySchema>;
