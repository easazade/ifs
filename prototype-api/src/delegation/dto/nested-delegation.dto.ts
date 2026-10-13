import { ApiPropertyOptional } from '@nestjs/swagger';
import { NestedPermissionDto } from '../../permission/dto/nested-permission.dto.js';

export class NestedDelegationDto {
  @ApiPropertyOptional({
    description:
      'Existing entity ID, or omit/use null or an empty string to create a new entity. An ID-only object links an existing entity; other supplied fields are merged or created.',
    nullable: true,
  })
  id?: string | null;

  @ApiPropertyOptional({
    description:
      'Entity type discriminator. Always "Delegation" for Delegation entities.',
    enum: ['Delegation'],
  })
  entityType?: 'Delegation';

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
    description: 'Timestamp when this delegation record was last updated.',
    format: 'date-time',
  })
  updatedAt?: string;

  @ApiPropertyOptional({
    description:
      'Identifier of the permission delegated from the delegator to the delegate.',
    pattern: '^Permission/[^/\\s]+$',
  })
  permissionId?: string;

  @ApiPropertyOptional({
    description:
      'Permission entity represented by permissionId when expanded by an implementation.',
    type: () => NestedPermissionDto,
  })
  permission?: NestedPermissionDto;

  @ApiPropertyOptional({
    description: 'ID of the role or member delegating the permission.',
    pattern: '^(Role|Member)/[^/\\s]+$',
  })
  delegatorId?: string;

  @ApiPropertyOptional({
    description: 'ID of the role or member receiving the delegated permission.',
    pattern: '^(Role|Member)/[^/\\s]+$',
  })
  delegateId?: string;

  @ApiPropertyOptional({
    description: 'Lifecycle state of the delegation.',
    enum: ['active', 'revoked', 'expired'],
  })
  state?: 'active' | 'revoked' | 'expired';

  @ApiPropertyOptional({
    description: 'Timestamp when this delegation was revoked, if applicable.',
    format: 'date-time',
  })
  revokedAt?: string;

  @ApiPropertyOptional({
    description:
      'Optional timestamp after which this delegation no longer applies.',
    format: 'date-time',
  })
  expiresAt?: string;

  [key: string]: unknown;
}
