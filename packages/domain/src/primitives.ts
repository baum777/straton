import { z } from 'zod';

export const UuidSchema = z.string().uuid();
export type Uuid = z.infer<typeof UuidSchema>;

export const Sha256HexSchema = z
  .string()
  .regex(/^[a-f0-9]{64}$/i, 'Expected sha256 hex string');
export type Sha256Hex = z.infer<typeof Sha256HexSchema>;

export const TimestampSchema = z.date();
export type Timestamp = z.infer<typeof TimestampSchema>;

