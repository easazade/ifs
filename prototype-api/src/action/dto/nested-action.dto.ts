import { ApiPropertyOptional } from '@nestjs/swagger';

export class NestedActionDto {
  @ApiPropertyOptional({
    description:
      'Existing entity ID, or omit/use null or an empty string to create a new entity. An ID-only object links an existing entity; other supplied fields are merged or created.',
    nullable: true,
  })
  id?: string | null;

  @ApiPropertyOptional({
    description:
      'Entity type discriminator. Always "Action" for Action entities.',
    enum: ['Action'],
  })
  entityType?: 'Action';

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
    description: 'Timestamp when this action record was last updated.',
    format: 'date-time',
  })
  updatedAt?: string;

  @ApiPropertyOptional({ description: 'Human-readable name of the action.' })
  name?: string;

  @ApiPropertyOptional({
    description:
      'Stable unique name used by IFS implementations to identify this action.',
  })
  uniqueName?: string;

  @ApiPropertyOptional({
    description:
      'Whether a member or role must hold an applicable permission before performing this action.',
  })
  requiresPermission?: boolean;

  @ApiPropertyOptional({ description: 'Describes the action.' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Instructions for how to perform the action.',
  })
  instructions?: string;

  @ApiPropertyOptional({ description: 'Additional notes about this action.' })
  notes?: string;

  @ApiPropertyOptional({
    description:
      'Warnings, risks, or constraints to review before performing this action.',
  })
  warnings?: string;

  @ApiPropertyOptional({
    description: 'Lifecycle state of the action.',
    enum: [
      'drafted',
      'under-review',
      'active',
      'suspended',
      'revoked',
      'deprecated',
    ],
  })
  state?:
    | 'drafted'
    | 'under-review'
    | 'active'
    | 'suspended'
    | 'revoked'
    | 'deprecated';

  [key: string]: unknown;
}
