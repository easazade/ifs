import { ApiPropertyOptional } from '@nestjs/swagger';
import { NestedOccurrenceDto } from '../../occurrence/dto/nested-occurrence.dto.js';
import { NestedRecurrenceDto } from '../../recurrence/dto/nested-recurrence.dto.js';

export class NestedWhenDto {
  @ApiPropertyOptional({
    description:
      'Existing entity ID, or omit/use null or an empty string to create a new entity. An ID-only object links an existing entity; other supplied fields are merged or created.',
    nullable: true,
  })
  id?: string | null;

  @ApiPropertyOptional({
    description: 'Entity type discriminator. Always "When" for When entities.',
    enum: ['When'],
  })
  entityType?: 'When';

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
    description: 'UTC timestamp when this schedule record was last updated.',
    format: 'date-time',
    pattern: 'Z$',
  })
  updatedAt?: string;

  @ApiPropertyOptional({
    description:
      'IANA timezone name for displaying UTC schedule timestamps; does not change recurrence timing.',
    minLength: 1,
  })
  timezone?: string;

  @ApiPropertyOptional({
    description:
      'Nonnegative ISO 8601 event duration used when a child entity omits its duration.',
    pattern:
      '^P(?!.*[.,][0-9]+[YMWDHS].*[0-9])(?=[0-9]|T[0-9])(?:[0-9]+(?:[.,][0-9]+)?W|(?:[0-9]+(?:[.,][0-9]+)?Y)?(?:[0-9]+(?:[.,][0-9]+)?M)?(?:[0-9]+(?:[.,][0-9]+)?D)?(?:T(?=[0-9])(?:[0-9]+(?:[.,][0-9]+)?H)?(?:[0-9]+(?:[.,][0-9]+)?M)?(?:[0-9]+(?:[.,][0-9]+)?S)?)?)$',
  })
  duration?: string;

  @ApiPropertyOptional({
    description:
      'Occurrence entities defining individual scheduled event times.',
    type: () => [NestedOccurrenceDto],
  })
  occurrences?: Array<NestedOccurrenceDto>;

  @ApiPropertyOptional({
    description: 'Recurrence entities defining repeating event schedules.',
    type: () => [NestedRecurrenceDto],
  })
  recurrences?: Array<NestedRecurrenceDto>;

  [key: string]: unknown;
}
