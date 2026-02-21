export type ReviewErrorCode =
  | 'REVIEW_REQUEST_NOT_FOUND'
  | 'REVIEW_REQUEST_EXPIRED'
  | 'REVIEW_REQUEST_ALREADY_USED'
  | 'REVIEW_REQUEST_INVALID_TOKEN'
  | 'REVIEW_REQUEST_PAYLOAD_HASH_MISMATCH'
  | 'REVIEW_REQUEST_INVALID_STATE'
  | 'REVIEW_REQUEST_CONCURRENT_MODIFICATION';

export class ReviewError extends Error {
  readonly code: ReviewErrorCode;

  constructor(code: ReviewErrorCode, message?: string) {
    super(message ?? code);
    this.name = 'ReviewError';
    this.code = code;
  }
}

