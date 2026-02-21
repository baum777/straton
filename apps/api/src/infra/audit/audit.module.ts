import { Module } from '@nestjs/common';
import { PostgresAuditWriter } from '@straton/audit';

export const AUDIT_WRITER = 'AUDIT_WRITER';

@Module({
  providers: [
    {
      provide: AUDIT_WRITER,
      useClass: PostgresAuditWriter,
    },
  ],
  exports: [AUDIT_WRITER],
})
export class AuditModule {}
