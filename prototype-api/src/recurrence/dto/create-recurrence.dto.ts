import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRecurrenceDto {
  @ApiProperty({
    description: 'Globally unique identifier for this recurrence.',
    pattern: '^Recurrence/[^/\\s]+$',
    allOf: [
      {
        type: 'string',
        description: 'Globally unique entity identifier in EntityType/ID form.',
        pattern: '^[A-Z][A-Za-z0-9]*/[^/\\s]+$',
      },
      {
        type: 'string',
        description: 'Globally unique identifier for this recurrence.',
        pattern: '^Recurrence/[^/\\s]+$',
      },
    ],
  })
  id: string;

  @ApiProperty({
    description:
      'Entity type discriminator. Always "Recurrence" for Recurrence entities.',
    enum: ['Recurrence'],
  })
  entityType: 'Recurrence';

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

  @ApiProperty({
    description: 'Label codes associated with this entity.',
    type: [String],
  })
  labelCodes: Array<string>;

  @ApiProperty({
    description:
      'UTC timestamp anchoring the recurrence and its earliest permitted event start.',
    format: 'date-time',
    pattern: 'Z$',
  })
  startsAt: string;

  @ApiPropertyOptional({
    description:
      'Inclusive UTC limit on event start times; omission leaves the recurrence unbounded.',
    format: 'date-time',
    pattern: 'Z$',
  })
  endsAt?: string;

  @ApiProperty({
    description:
      'Named UTC calendar frequency or a strictly positive ISO 8601 repeating duration.',
    anyOf: [
      { enum: ['hourly', 'daily', 'weekly', 'monthly', 'yearly'] },
      {
        type: 'string',
        description:
          'Nonnegative ISO 8601 duration in component notation; fractions occur only on the smallest unit.',
        pattern: '^P(?=.*[1-9])',
        allOf: [
          {
            type: 'string',
            description:
              'Nonnegative ISO 8601 duration in component notation; fractions occur only on the smallest unit.',
            pattern:
              '^P(?!.*[.,][0-9]+[YMWDHS].*[0-9])(?=[0-9]|T[0-9])(?:[0-9]+(?:[.,][0-9]+)?W|(?:[0-9]+(?:[.,][0-9]+)?Y)?(?:[0-9]+(?:[.,][0-9]+)?M)?(?:[0-9]+(?:[.,][0-9]+)?D)?(?:T(?=[0-9])(?:[0-9]+(?:[.,][0-9]+)?H)?(?:[0-9]+(?:[.,][0-9]+)?M)?(?:[0-9]+(?:[.,][0-9]+)?S)?)?)$',
          },
          { pattern: '^P(?=.*[1-9])' },
        ],
      },
    ],
  })
  frequency: string;

  @ApiPropertyOptional({
    description:
      'Positive multiplier applied to the frequency; treated as 1 when omitted.',
    minimum: 1,
  })
  interval?: number;

  @ApiPropertyOptional({
    description:
      'UTC weekday filter for weekly event starts; requires weekly frequency. Weeks begin on Monday.',
    minItems: 1,
    uniqueItems: true,
    type: 'array',
    items: {
      type: 'string',
      enum: [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
      ],
    },
  })
  daysOfWeek?: Array<
    | 'monday'
    | 'tuesday'
    | 'wednesday'
    | 'thursday'
    | 'friday'
    | 'saturday'
    | 'sunday'
  >;

  @ApiPropertyOptional({
    description:
      'Event duration overriding When.duration; omission inherits the schedule default, not frequency.',
    pattern:
      '^P(?!.*[.,][0-9]+[YMWDHS].*[0-9])(?=[0-9]|T[0-9])(?:[0-9]+(?:[.,][0-9]+)?W|(?:[0-9]+(?:[.,][0-9]+)?Y)?(?:[0-9]+(?:[.,][0-9]+)?M)?(?:[0-9]+(?:[.,][0-9]+)?D)?(?:T(?=[0-9])(?:[0-9]+(?:[.,][0-9]+)?H)?(?:[0-9]+(?:[.,][0-9]+)?M)?(?:[0-9]+(?:[.,][0-9]+)?S)?)?)$',
  })
  duration?: string;

  [key: string]: unknown;
}
