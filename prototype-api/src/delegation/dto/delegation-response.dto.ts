import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PermissionResponseDto } from '../../permission/dto/permission-response.dto.js';

export class DelegationResponseDto {
  @ApiProperty({
    description: 'Globally unique identifier for this delegation.',
  })
  id: string;

  @ApiProperty({ description: 'IFS system identifier for this Delegation.' })
  ifsId: string;

  @ApiProperty({
    description: 'Entity category for this object, normally Delegation.',
  })
  entityType: string;

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
  })
  permissionId: string;

  @ApiPropertyOptional({
    description:
      'Permission entity represented by permissionId when expanded by an implementation.',
    type: () => PermissionResponseDto,
  })
  permission?: PermissionResponseDto;

  @ApiProperty({
    description: 'Reference to the role or member delegating the permission.',
    format: 'ifs-ref',
  })
  delegatorRef: string;

  @ApiProperty({
    description:
      'Reference to the role or member receiving the delegated permission.',
    format: 'ifs-ref',
  })
  delegateRef: string;

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
