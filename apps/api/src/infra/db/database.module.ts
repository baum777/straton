import { Global, Module } from '@nestjs/common';
import { Pool } from 'pg';

const DATABASE_URL = process.env.DATABASE_URL;

export const POOL = 'PG_POOL';

@Global()
@Module({
  providers: [
    {
      provide: POOL,
      useFactory: (): Pool => {
        if (!DATABASE_URL) {
          throw new Error('DATABASE_URL is required for database operations');
        }
        return new Pool({ connectionString: DATABASE_URL });
      },
    },
  ],
  exports: [POOL],
})
export class DatabaseModule {}
