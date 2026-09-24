import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class VoteResponseDto {
  @ApiProperty({ description: 'Globally unique identifier for this vote.' })
  id: string;

  @ApiProperty({ description: 'IFS system identifier for this Vote.' })
  ifsId: string;

  @ApiProperty({
    description: 'Entity category for this object, normally Vote.',
  })
  entityType: string;

  @ApiPropertyOptional({
    description: 'Id of the object this object is derived from.',
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
  })
  decisionId: string;

  @ApiProperty({
    description: 'Identifier of the member who cast or owns this vote.',
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
  })
  previousRevisionId?: string;

  [key: string]: unknown;
}
