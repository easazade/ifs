import { ApiPropertyOptional } from '@nestjs/swagger';

export class NestedRelationshipDto {
  @ApiPropertyOptional({
    description:
      'Existing entity ID, or omit/use null or an empty string to create a new entity. An ID-only object links an existing entity; other supplied fields are merged or created.',
    nullable: true,
  })
  id?: string | null;

  @ApiPropertyOptional({
    description:
      'Entity type discriminator. Always "Relationship" for Relationship entities.',
    enum: ['Relationship'],
  })
  entityType?: 'Relationship';

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
    description: 'Timestamp when this relationship record was last updated.',
    format: 'date-time',
  })
  updatedAt?: string;

  @ApiPropertyOptional({
    description:
      "ID of the RelationshipType defining this relationship's type, inverse type, and allowed source and target types.",
    pattern: '^RelationshipType/[^/\\s]+$',
  })
  relationshipTypeId?: string;

  @ApiPropertyOptional({
    description:
      "Relationship name copied from the selected RelationshipType object's type field.",
    minLength: 1,
  })
  type?: string;

  @ApiPropertyOptional({
    description:
      "Inverse relationship name copied from the selected RelationshipType object's inverseType field.",
    minLength: 1,
  })
  inverseType?: string;

  @ApiPropertyOptional({
    description:
      "ID of the source entity, such as Organization/1; its type must be allowed by the selected RelationshipType's sourceTypes.",
    pattern: '^[A-Z][A-Za-z0-9]*/[^/\\s]+$',
  })
  sourceId?: string;

  @ApiPropertyOptional({
    description:
      "ID of the target entity, such as Member/1; its type must be allowed by the selected RelationshipType's targetTypes.",
    pattern: '^[A-Z][A-Za-z0-9]*/[^/\\s]+$',
  })
  targetId?: string;

  @ApiPropertyOptional({
    description: 'Calendar date when this relationship began.',
    format: 'date',
  })
  startedAt?: string;

  @ApiPropertyOptional({
    description:
      'Optional calendar date when this relationship ended; must not precede startedAt.',
    format: 'date',
  })
  endedAt?: string;

  [key: string]: unknown;
}
