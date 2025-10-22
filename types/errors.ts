/**
 * Error response interface
 */
export interface ErrorResponse {
  error: string;
  code: string;
  statusCode: number;
  details?: any;
  timestamp: string;
}
