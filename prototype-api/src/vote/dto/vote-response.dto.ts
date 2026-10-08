import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class VoteResponseDto {
  @ApiProperty({
    description: 'Globally unique identifier for this vote.',
    pattern: '^Vote/[^/\\s]+$',
  })
  id: string;

  @ApiProperty({
    description: 'Entity type discriminator. Always "Vote" for Vote entities.',
    enum: ['Vote'],
  })
  entityType: 'Vote';

  @ApiPropertyOptional({
    description: 'Id of the object this object is derived from.',
    pattern: '^[A-Z][A-Za-z0-9]*/[^/\\s]+$',
  })
  basedOn?: string;

  @ApiProperty({
    description: 'URL for documentation about this entity.',
    format: 'uri',
  })
  entityDocumentationUrl: string;

  @ApiProperty({
    description: 'Timestamp when this vote record was created.',
    format: 'date-time',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Timestamp when this vote record was last updated.',
    format: 'date-time',
  })
  updatedAt: string;

  @ApiProperty({
    description: 'Identifier of the decision this vote participates in.',
    pattern: '^Decision/[^/\\s]+$',
  })
  decisionId: string;

  @ApiProperty({
    description: 'Identifier of the member who cast or owns this vote.',
    pattern: '^Member/[^/\\s]+$',
  })
  memberId: string;

  @ApiProperty({
    description:
      'Vote value recorded for the decision, such as an implementation-defined choice or consent signal.',
  })
  value: string;

  @ApiPropertyOptional({
    description:
      'Identifier of the previous revision of this vote, if this vote amends an earlier vote.',
    pattern: '^Vote/[^/\\s]+$',
  })
  previousRevisionId?: string;

  [key: string]: unknown;
}
