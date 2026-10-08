import { BadRequestException } from '@nestjs/common';

// Validate before any database operation; PATCH may omit the discriminator.
export function assertEntityType(
  data: unknown,
  expectedType: string,
  partial = false,
): void {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new BadRequestException('An entity object is required.');
  }
  if (partial && !Object.hasOwn(data, 'entityType')) return;
  if ((data as Record<string, unknown>).entityType !== expectedType) {
    throw new BadRequestException(
      `entityType must be exactly "${expectedType}".`,
    );
  }
}
