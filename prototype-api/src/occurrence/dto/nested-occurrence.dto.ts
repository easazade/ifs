import { ApiPropertyOptional } from '@nestjs/swagger';

export class NestedOccurrenceDto {
  @ApiPropertyOptional({
    description:
      'Existing entity ID, or omit/use null or an empty string to create a new entity. An ID-only object links an existing entity; other supplied fields are merged or created.',
    nullable: true,
  })
  id?: string | null;

  @ApiPropertyOptional({
    description:
      'Entity type discriminator. Always "Occurrence" for Occurrence entities.',
    enum: ['Occurrence'],
  })
  entityType?: 'Occurrence';

  @ApiPropertyOptional({
    description: 'Id of the object this object is derived from.',
    pattern: '^[A-Z][A-Za-z0-9]*/[^/\\s]+$',
  })
  basedOn?: string;

  @ApiPropertyOptional({
    description: 'URL for documentation about this entity type.',
    format: 'uri',
  })
  entityDocumentationUrl?: string;

  @ApiPropertyOptional({
    description: 'URL for documentation about this object instance',
    format: 'uri',
  })
  documentationUrl?: string;

  @ApiPropertyOptional({
    description: 'Timestamp when this entity record was created.',
    format: 'date-time',
  })
  createdAt?: string;

  @ApiPropertyOptional({
    description: 'Label codes associated with this entity.',
    type: [String],
  })
  labelCodes?: Array<string>;

  @ApiPropertyOptional({
    description: 'UTC timestamp when the event starts.',
    format: 'date-time',
    pattern: 'Z$',
  })
  startsAt?: string;

  @ApiPropertyOptional({
    description:
      'Nonnegative ISO 8601 event duration overriding When.duration; omission inherits the schedule default.',
    pattern:
      '^P(?!.*[.,][0-9]+[YMWDHS].*[0-9])(?=[0-9]|T[0-9])(?:[0-9]+(?:[.,][0-9]+)?W|(?:[0-9]+(?:[.,][0-9]+)?Y)?(?:[0-9]+(?:[.,][0-9]+)?M)?(?:[0-9]+(?:[.,][0-9]+)?D)?(?:T(?=[0-9])(?:[0-9]+(?:[.,][0-9]+)?H)?(?:[0-9]+(?:[.,][0-9]+)?M)?(?:[0-9]+(?:[.,][0-9]+)?S)?)?)$',
  })
  duration?: string;

  [key: string]: unknown;
}
