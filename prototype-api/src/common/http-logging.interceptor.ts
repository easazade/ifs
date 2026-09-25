import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import type { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

const MAX_BODY_LENGTH = 1_000;
const SENSITIVE_KEY =
  /^(authorization|cookie|password|token|secret|api[-_]?key)$/i;

// Like a Dart interceptor, this wraps every HTTP handler without changing its result.
@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();
    const startedAt = performance.now();
    const requestSummary = this.format(request.body);

    return next.handle().pipe(
      tap({
        next: (body) => {
          this.logger.log(
            this.line(
              request,
              response.statusCode,
              startedAt,
              requestSummary,
              this.format(body),
            ),
          );
        },
        error: (error: unknown) => {
          const status =
            error instanceof HttpException ? error.getStatus() : 500;
          const body =
            error instanceof HttpException
              ? error.getResponse()
              : { statusCode: 500, message: 'Internal server error' };

          this.logger.error(
            this.line(
              request,
              status,
              startedAt,
              requestSummary,
              this.format(body),
            ),
          );
        },
      }),
    );
  }

  private line(
    request: Request,
    status: number,
    startedAt: number,
    requestBody: string,
    responseBody: string,
  ): string {
    const elapsed = Math.round(performance.now() - startedAt);
    return `${request.method} ${request.originalUrl ?? request.url} ${status} ${elapsed}ms req=${requestBody} res=${responseBody}`;
  }

  private format(value: unknown): string {
    if (value === undefined) return '-';

    const seen = new WeakSet<object>();
    let output: string;

    try {
      output =
        JSON.stringify(value, (key, nestedValue: unknown) => {
          if (SENSITIVE_KEY.test(key)) return '[REDACTED]';
          if (typeof nestedValue === 'bigint') return nestedValue.toString();
          if (nestedValue && typeof nestedValue === 'object') {
            if (seen.has(nestedValue)) return '[Circular]';
            seen.add(nestedValue);
          }
          return nestedValue;
        }) ?? String(value);
    } catch {
      output = '[Unserializable]';
    }

    return output.length <= MAX_BODY_LENGTH
      ? output
      : `${output.slice(0, MAX_BODY_LENGTH)}…`;
  }
}
