import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NestedActionDto } from '../../action/dto/nested-action.dto.js';

export class CreatePermissionDto {
  @ApiProperty({
    description: 'Globally unique identifier for this permission.',
    pattern: '^Permission/[^/\\s]+$',
    allOf: [
      {
        type: 'string',
        description: 'Globally unique entity identifier in EntityType/ID form.',
        pattern: '^[A-Z][A-Za-z0-9]*/[^/\\s]+$',
      },
      {
        type: 'string',
        description: 'Globally unique identifier for this permission.',
        pattern: '^Permission/[^/\\s]+$',
      },
    ],
  })
  id: string;

  @ApiProperty({
    description:
      'Entity type discriminator. Always "Permission" for Permission entities.',
    enum: ['Permission'],
  })
  entityType: 'Permission';

  @ApiPropertyOptional({
    description: 'Id of the object this object is derived from.',
    pattern: '^[A-Z][A-Za-z0-9]*/[^/\\s]+$',
  })
  basedOn?: string;

  @ApiProperty({
    description: 'URL for documentation about this entity type.',
    format: 'uri',
  })
  entityDocumentationUrl: string;

  @ApiPropertyOptional({
    description: 'URL for documentation about this object instance',
    format: 'uri',
  })
  documentationUrl?: string;

  @ApiProperty({
    description: 'Timestamp when this entity record was created.',
    format: 'date-time',
  })
  createdAt: string;

  @ApiPropertyOptional({
    description: 'Label codes associated with this entity.',
    type: [String],
  })
  labelCodes?: Array<string>;

  @ApiProperty({
    description: 'ID list of actions that this permission allows',
    type: [String],
  })
  actionIds: Array<string>;

  @ApiPropertyOptional({
    description: 'List of actions that this permission allows',
    type: () => [NestedActionDto],
  })
  actions?: Array<NestedActionDto>;

  @ApiPropertyOptional({
    description: 'Identifier of the member receiving this permission.',
    pattern: '^Member/[^/\\s]+$',
  })
  memberId?: string;

  @ApiPropertyOptional({
    description: 'Identifier of the role receiving this permission.',
    pattern: '^Role/[^/\\s]+$',
  })
  roleId?: string;

  @ApiProperty({
    description:
      'Identifier of the scope object where this permission applies.',
    pattern: '^Scope/[^/\\s]+$',
  })
  scopeId: string;

  @ApiPropertyOptional({
    description:
      'Scope object describing the system, project, process, area, or other bounded context where this permission applies.',
    type: 'object',
    additionalProperties: true,
  })
  scope?: Record<string, unknown>;

  @ApiProperty({
    description:
      'Lifecycle state of the permission. Example values may include drafted, under-review, active, suspended, or revoked.',
    enum: ['granted', 'under-review', 'revoked', 'drafted'],
  })
  state: 'granted' | 'under-review' | 'revoked' | 'drafted';

  @ApiPropertyOptional({
    description: 'Timestamp when this permission record was last updated.',
    format: 'date-time',
  })
  updatedAt?: string;

  @ApiProperty({
    description:
      'Optional timestamp after which this permission no longer applies.',
    format: 'date-time',
  })
  expiresAt: string;

  [key: string]: unknown;
}
