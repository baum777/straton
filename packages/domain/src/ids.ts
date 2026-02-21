import { z } from 'zod';

/** UUID v4 for all entity IDs */
export const UuidSchema = z.string().uuid();
export type Uuid = z.infer<typeof UuidSchema>;
