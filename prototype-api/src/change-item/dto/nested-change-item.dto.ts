import { ApiPropertyOptional } from '@nestjs/swagger';

export class NestedChangeItemDto {
  @ApiPropertyOptional({
    description:
      'Existing entity ID, or omit/use null or an empty string to create a new entity. An ID-only object links an existing entity; other supplied fields are merged or created.',
    nullable: true,
  })
  id?: string | null;

  @ApiPropertyOptional({
    description:
      'Entity type discriminator. Always "ChangeItem" for ChangeItem entities.',
    enum: ['ChangeItem'],
  })
  entityType?: 'ChangeItem';

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
    description:
      'Resource category for this change item, such as rule, scope, protocol, record, or resource.',
  })
  resourceType?: string;

  @ApiPropertyOptional({
    description: 'Type of operation this item proposes for the target object.',
    enum: ['update', 'create', 'delete', 'replace'],
  })
  operation?: 'update' | 'create' | 'delete' | 'replace';

  @ApiPropertyOptional({
    description:
      'ID of the logical object being changed. Null for create operations.',
    nullable: true,
    pattern: '^[A-Z][A-Za-z0-9]*/[^/\\s]+$',
  })
  targetId?: string | null;

  @ApiPropertyOptional({
    description:
      'ID of the active version observed when authored, for conflict detection. Null for create operations.',
    nullable: true,
    pattern: '^[A-Z][A-Za-z0-9]*/[^/\\s]+$',
  })
  baseId?: string | null;

  @ApiPropertyOptional({
    description:
      'ID of the proposed object or version. Null for delete operations.',
    nullable: true,
    pattern: '^[A-Z][A-Za-z0-9]*/[^/\\s]+$',
  })
  proposedId?: string | null;

  @ApiPropertyOptional({
    description: 'Optional human-readable note explaining this specific item.',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Timestamp when this change item was last updated.',
    format: 'date-time',
  })
  updatedAt?: string;

  [key: string]: unknown;
}
