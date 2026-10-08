import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RelationshipResponseDto {
  @ApiProperty({
    description: 'Globally unique identifier for this relationship.',
    pattern: '^Relationship/[^/\\s]+$',
  })
  id: string;

  @ApiProperty({
    description: 'Entity category for this object, normally Relationship.',
  })
  entityType: string;

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
    description: 'Timestamp when this relationship record was created.',
    format: 'date-time',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Timestamp when this relationship record was last updated.',
    format: 'date-time',
  })
  updatedAt: string;

  @ApiProperty({
    description:
      "ID of the RelationshipType defining this relationship's type, inverse type, and allowed source and target types.",
    pattern: '^RelationshipType/[^/\\s]+$',
  })
  relationshipTypeId: string;

  @ApiProperty({
    description:
      "Relationship name copied from the selected RelationshipType object's type field.",
    minLength: 1,
  })
  type: string;

  @ApiProperty({
    description:
      "Inverse relationship name copied from the selected RelationshipType object's inverseType field.",
    minLength: 1,
  })
  inverseType: string;

  @ApiProperty({
    description:
      "ID of the source entity, such as Organization/1; its type must be allowed by the selected RelationshipType's sourceTypes.",
    pattern: '^[A-Z][A-Za-z0-9]*/[^/\\s]+$',
  })
  sourceId: string;

  @ApiProperty({
    description:
      "ID of the target entity, such as Member/1; its type must be allowed by the selected RelationshipType's targetTypes.",
    pattern: '^[A-Z][A-Za-z0-9]*/[^/\\s]+$',
  })
  targetId: string;

  @ApiProperty({
    description: 'Calendar date when this relationship began.',
    format: 'date',
  })
  startedAt: string;

  @ApiPropertyOptional({
    description:
      'Optional calendar date when this relationship ended; must not precede startedAt.',
    format: 'date',
  })
  endedAt?: string;

  [key: string]: unknown;
}
