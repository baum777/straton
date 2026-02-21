import crypto from 'node:crypto';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    (Object.getPrototypeOf(value) === Object.prototype ||
      Object.getPrototypeOf(value) === null)
  );
}

export function stableStringify(value: unknown): string {
  if (value === null) return 'null';

  const t = typeof value;
  if (t === 'number' || t === 'boolean') return JSON.stringify(value);
  if (t === 'string') return JSON.stringify(value);
  if (t === 'bigint') return JSON.stringify(value.toString());
  if (t === 'undefined') return JSON.stringify(null);

  if (value instanceof Date) return JSON.stringify(value.toISOString());

  if (Array.isArray(value)) {
    return `[${value.map((v) => stableStringify(v)).join(',')}]`;
  }

  if (isPlainObject(value)) {
    const keys = Object.keys(value).sort();
    const body = keys
      .map((k) => `${JSON.stringify(k)}:${stableStringify(value[k])}`)
      .join(',');
    return `{${body}}`;
  }

  // Fallback: rely on JSON serialization for other objects.
  return stableStringify(JSON.parse(JSON.stringify(value)));
}

export function sha256Hex(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}

export function hashPayload(payload: unknown): string {
  return sha256Hex(stableStringify(payload));
}

export function generateCommitToken(): { token: string; tokenHash: string } {
  const raw = crypto.randomBytes(32).toString('base64url');
  const token = `ct_${raw}`;
  const tokenHash = sha256Hex(token);
  return { token, tokenHash };
}

