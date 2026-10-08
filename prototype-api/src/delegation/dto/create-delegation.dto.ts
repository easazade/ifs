import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PermissionResponseDto } from '../../permission/dto/permission-response.dto.js';

export class CreateDelegationDto {
  @ApiProperty({
    description: 'Globally unique identifier for this delegation.',
    pattern: '^Delegation/[^/\\s]+$',
  })
  id: string;

  @ApiProperty({
    description:
      'Entity type discriminator. Always "Delegation" for Delegation entities.',
    enum: ['Delegation'],
  })
  entityType: 'Delegation';

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
    description: 'Timestamp when this delegation record was created.',
    format: 'date-time',
  })
  createdAt: string;

  @ApiPropertyOptional({
    description: 'Timestamp when this delegation record was last updated.',
    format: 'date-time',
  })
  updatedAt?: string;

  @ApiProperty({
    description:
      'Identifier of the permission delegated from the delegator to the delegate.',
    pattern: '^Permission/[^/\\s]+$',
  })
  permissionId: string;

  @ApiPropertyOptional({
    description:
      'Permission entity represented by permissionId when expanded by an implementation.',
    type: () => PermissionResponseDto,
  })
  permission?: PermissionResponseDto;

  @ApiProperty({
    description: 'ID of the role or member delegating the permission.',
    pattern: '^(Role|Member)/[^/\\s]+$',
  })
  delegatorId: string;

  @ApiProperty({
    description: 'ID of the role or member receiving the delegated permission.',
    pattern: '^(Role|Member)/[^/\\s]+$',
  })
  delegateId: string;

  @ApiProperty({
    description: 'Lifecycle state of the delegation.',
    enum: ['active', 'revoked', 'expired'],
  })
  state: 'active' | 'revoked' | 'expired';

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
