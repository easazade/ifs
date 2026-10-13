import { ApiPropertyOptional } from '@nestjs/swagger';

export class NestedRelationshipTypeDto {
  @ApiPropertyOptional({
    description:
      'Existing entity ID, or omit/use null or an empty string to create a new entity. An ID-only object links an existing entity; other supplied fields are merged or created.',
    nullable: true,
  })
  id?: string | null;

  @ApiPropertyOptional({
    description:
      'Entity type discriminator. Always "RelationshipType" for RelationshipType entities.',
    enum: ['RelationshipType'],
  })
  entityType?: 'RelationshipType';

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
    description: 'Timestamp when this relationship type was last updated.',
    format: 'date-time',
  })
  updatedAt?: string;

  @ApiPropertyOptional({
    description:
      'Relationship name, such as partnered, governed by, or resides in.',
    minLength: 1,
  })
  type?: string;

  @ApiPropertyOptional({
    description: 'Meaning and intended use of this relationship type.',
  })
  description?: string;

  @ApiPropertyOptional({
    description:
      'Entity type names allowed as sources of relationships of this type.',
    minItems: 1,
    uniqueItems: true,
    type: [String],
  })
  sourceTypes?: Array<string>;

  @ApiPropertyOptional({
    description:
      'Entity type names allowed as targets of relationships of this type.',
    minItems: 1,
    uniqueItems: true,
    type: [String],
  })
  targetTypes?: Array<string>;

  @ApiPropertyOptional({
    description:
      'Whether swapping source and target preserves the relationship meaning, such as partnered.',
  })
  symmetric?: boolean;

  @ApiPropertyOptional({
    description:
      'Inverse relationship name used when source and target are swapped, such as `has-member` for `member-of`. This is a label, not a relationship type ID.',
    minLength: 1,
  })
  inverseType?: string;

  [key: string]: unknown;
}
