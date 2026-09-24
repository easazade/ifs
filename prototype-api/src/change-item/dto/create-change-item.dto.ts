import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateChangeItemDto {
  @ApiProperty({
    description: 'Globally unique identifier for this change item.',
  })
  id: string;

  @ApiProperty({ description: 'IFS system identifier for this ChangeItem.' })
  ifsId: string;

  @ApiProperty({
    description:
      'Entity type discriminator. Always "ChangeItem" for ChangeItem entities.',
    enum: ['ChangeItem'],
  })
  entityType: 'ChangeItem';

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
      'Stable IFS reference for the logical object being changed. Null for create operations where no active target exists yet.',
    format: 'ifs-ref',
    nullable: true,
  })
  targetRef: string | null;

  @ApiProperty({
    description:
      'IFS reference to the active version observed when the change item was authored. Used for conflict detection. Null for create operations.',
    format: 'ifs-ref',
    nullable: true,
  })
  baseRef: string | null;

  @ApiProperty({
    description:
      'IFS reference to the proposed object or version produced by this change item. Null for delete operations.',
    format: 'ifs-ref',
    nullable: true,
  })
  proposedRef: string | null;

  @ApiPropertyOptional({
    description: 'Optional human-readable note explaining this specific item.',
  })
  description?: string;

  @ApiProperty({
    description: 'Timestamp when this change item was created.',
    format: 'date-time',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Timestamp when this change item was last updated.',
    format: 'date-time',
  })
  updatedAt: string;

  [key: string]: unknown;
}
