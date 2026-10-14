import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OccurrenceResponseDto } from '../../occurrence/dto/occurrence-response.dto.js';
import { RecurrenceResponseDto } from '../../recurrence/dto/recurrence-response.dto.js';

export class WhenResponseDto {
  @ApiProperty({
    description: 'Globally unique identifier for this schedule.',
    pattern: '^When/[^/\\s]+$',
    allOf: [
      {
        type: 'string',
        description: 'Globally unique entity identifier in EntityType/ID form.',
        pattern: '^[A-Z][A-Za-z0-9]*/[^/\\s]+$',
      },
      {
        type: 'string',
        description: 'Globally unique identifier for this schedule.',
        pattern: '^When/[^/\\s]+$',
      },
    ],
  })
  id: string;

  @ApiProperty({
    description: 'Entity type discriminator. Always "When" for When entities.',
    enum: ['When'],
  })
  entityType: 'When';

  @ApiPropertyOptional({
    description: 'Id of the object this object is derived from.',
    pattern: '^[A-Z][A-Za-z0-9]*/[^/\\s]+$',
  })
  basedOn?: string;

  @ApiProperty({
    description: 'URL for documentation about this entity type.',
    format: 'uri',
  })
  entityDocumentationUrl: string;

  @ApiPropertyOptional({
    description: 'URL for documentation about this object instance',
    format: 'uri',
  })
  documentationUrl?: string;

  @ApiProperty({
    description: 'Timestamp when this entity record was created.',
    format: 'date-time',
  })
  createdAt: string;

  @ApiPropertyOptional({
    description: 'Label codes associated with this entity.',
    type: [String],
  })
  labelCodes?: Array<string>;

  @ApiProperty({
    description: 'UTC timestamp when this schedule record was last updated.',
    format: 'date-time',
    pattern: 'Z$',
  })
  updatedAt: string;

  @ApiProperty({
    description:
      'IANA timezone name for displaying UTC schedule timestamps; does not change recurrence timing.',
    minLength: 1,
  })
  timezone: string;

  @ApiProperty({
    description:
      'Nonnegative ISO 8601 event duration used when a child entity omits its duration.',
    pattern:
      '^P(?!.*[.,][0-9]+[YMWDHS].*[0-9])(?=[0-9]|T[0-9])(?:[0-9]+(?:[.,][0-9]+)?W|(?:[0-9]+(?:[.,][0-9]+)?Y)?(?:[0-9]+(?:[.,][0-9]+)?M)?(?:[0-9]+(?:[.,][0-9]+)?D)?(?:T(?=[0-9])(?:[0-9]+(?:[.,][0-9]+)?H)?(?:[0-9]+(?:[.,][0-9]+)?M)?(?:[0-9]+(?:[.,][0-9]+)?S)?)?)$',
  })
  duration: string;

  @ApiProperty({
    description:
      'Occurrence entities defining individual scheduled event times.',
    type: () => [OccurrenceResponseDto],
  })
  occurrences: Array<OccurrenceResponseDto | { id: string }>;

  @ApiProperty({
    description: 'Recurrence entities defining repeating event schedules.',
    type: () => [RecurrenceResponseDto],
  })
  recurrences: Array<RecurrenceResponseDto | { id: string }>;

  [key: string]: unknown;
}
