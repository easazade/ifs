import { ApiPropertyOptional } from '@nestjs/swagger';

export class NestedVoteDto {
  @ApiPropertyOptional({
    description:
      'Existing entity ID, or omit/use null or an empty string to create a new entity. An ID-only object links an existing entity; other supplied fields are merged or created.',
    nullable: true,
  })
  id?: string | null;

  @ApiPropertyOptional({
    description: 'Entity type discriminator. Always "Vote" for Vote entities.',
    enum: ['Vote'],
  })
  entityType?: 'Vote';

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
    description: 'Timestamp when this vote record was last updated.',
    format: 'date-time',
  })
  updatedAt?: string;

  @ApiPropertyOptional({
    description: 'Identifier of the decision this vote participates in.',
    pattern: '^Decision/[^/\\s]+$',
  })
  decisionId?: string;

  @ApiPropertyOptional({
    description: 'Identifier of the member who cast or owns this vote.',
    pattern: '^Member/[^/\\s]+$',
  })
  memberId?: string;

  @ApiPropertyOptional({
    description:
      'Vote value recorded for the decision, such as an implementation-defined choice or consent signal.',
  })
  value?: string;

  @ApiPropertyOptional({
    description:
      'Identifier of the previous revision of this vote, if this vote amends an earlier vote.',
    pattern: '^Vote/[^/\\s]+$',
  })
  previousRevisionId?: string;

  [key: string]: unknown;
}
