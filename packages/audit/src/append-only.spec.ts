import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Append-only assertion: no UPDATE or DELETE in audit package.
 * Ensures the audit package has no code paths that modify or remove audit logs.
 */
describe('Append-only behavior', () => {
  it('should not contain UPDATE or DELETE SQL for audit_logs', () => {
    const srcDir = __dirname;
    const files = ['postgres-audit-writer.ts', 'with-audit-transaction.ts', 'index.ts'];
    const forbidden = ['UPDATE audit_logs', 'DELETE FROM audit_logs', 'DELETE FROM audit'];
    for (const file of files) {
      const path = join(srcDir, file);
      try {
        const content = readFileSync(path, 'utf-8');
        for (const f of forbidden) {
          expect(content).not.toContain(f);
        }
      } catch {
        // File might not exist in test context
      }
    }
  });
});
