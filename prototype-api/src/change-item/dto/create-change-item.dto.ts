import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateChangeItemDto {
  @ApiProperty({
    description: 'Globally unique identifier for this change item.',
    pattern: '^ChangeItem/[^/\\s]+$',
    allOf: [
      {
        type: 'string',
        description: 'Globally unique entity identifier in EntityType/ID form.',
        pattern: '^[A-Z][A-Za-z0-9]*/[^/\\s]+$',
      },
      {
        type: 'string',
        description: 'Globally unique identifier for this change item.',
        pattern: '^ChangeItem/[^/\\s]+$',
      },
    ],
  })
  id: string;

  @ApiProperty({
    description:
      'Entity type discriminator. Always "ChangeItem" for ChangeItem entities.',
    enum: ['ChangeItem'],
  })
  entityType: 'ChangeItem';

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
    description: 'Timestamp when this entity record was created.',
    format: 'date-time',
  })
  createdAt: string;

  @ApiProperty({
    description:
      'Resource category for this change item, such as rule, scope, protocol, record, or resource.',
  })
  resourceType: string;

  @ApiProperty({
    description: 'Type of operation this item proposes for the target object.',
    enum: ['update', 'create', 'delete', 'replace'],
  })
  operation: 'update' | 'create' | 'delete' | 'replace';

  @ApiProperty({
    description:
      'ID of the logical object being changed. Null for create operations.',
    nullable: true,
    pattern: '^[A-Z][A-Za-z0-9]*/[^/\\s]+$',
  })
  targetId: string | null;

  @ApiProperty({
    description:
      'ID of the active version observed when authored, for conflict detection. Null for create operations.',
    nullable: true,
    pattern: '^[A-Z][A-Za-z0-9]*/[^/\\s]+$',
  })
  baseId: string | null;

  @ApiProperty({
    description:
      'ID of the proposed object or version. Null for delete operations.',
    nullable: true,
    pattern: '^[A-Z][A-Za-z0-9]*/[^/\\s]+$',
  })
  proposedId: string | null;

  @ApiPropertyOptional({
    description: 'Optional human-readable note explaining this specific item.',
  })
  description?: string;

  @ApiProperty({
    description: 'Timestamp when this change item was last updated.',
    format: 'date-time',
  })
  updatedAt: string;

  [key: string]: unknown;
}
