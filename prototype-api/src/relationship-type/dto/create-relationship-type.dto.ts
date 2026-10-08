import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRelationshipTypeDto {
  @ApiProperty({
    description: 'Globally unique identifier for this relationship type.',
    pattern: '^RelationshipType/[^/\\s]+$',
  })
  id: string;

  @ApiProperty({
    description: 'Entity category for this object, normally RelationshipType.',
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
    description: 'Timestamp when this relationship type was created.',
    format: 'date-time',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Timestamp when this relationship type was last updated.',
    format: 'date-time',
  })
  updatedAt: string;

  @ApiProperty({
    description:
      'Relationship name, such as partnered, governed by, or resides in.',
    minLength: 1,
  })
  type: string;

  @ApiProperty({
    description: 'Meaning and intended use of this relationship type.',
  })
  description: string;

  @ApiProperty({
    description:
      'Entity type names allowed as sources of relationships of this type.',
    minItems: 1,
    uniqueItems: true,
    type: [String],
  })
  sourceTypes: Array<string>;

  @ApiProperty({
    description:
      'Entity type names allowed as targets of relationships of this type.',
    minItems: 1,
    uniqueItems: true,
    type: [String],
  })
  targetTypes: Array<string>;

  @ApiProperty({
    description:
      'Whether swapping source and target preserves the relationship meaning, such as partnered.',
  })
  symmetric: boolean;

  @ApiProperty({
    description:
      'ID of the relationship type used when source and target are swapped, such as governed by to governs.',
    minLength: 1,
  })
  inverseType: string;

  [key: string]: unknown;
}
