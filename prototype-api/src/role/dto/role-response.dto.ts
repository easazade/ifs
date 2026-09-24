import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PermissionResponseDto } from '../../permission/dto/permission-response.dto.js';
import { ScopeResponseDto } from '../../scope/dto/scope-response.dto.js';

export class RoleResponseDto {
  @ApiProperty({
    description: 'Globally unique identifier for this role.',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({ description: 'IFS system identifier for this Role.' })
  ifsId: string;

  @ApiProperty({
    description: 'Entity type discriminator. Always "Role" for Role entities.',
    enum: ['Role'],
  })
  entityType: 'Role';

  @ApiPropertyOptional({
    description: 'Id of the object this object is derived from.',
  })
  basedOn?: string;

  @ApiProperty({
    description: 'URL for documentation about this entity.',
    format: 'uri',
  })
  entityDocumentationUrl: string;

  @ApiProperty({ description: 'Human-readable name of the role.' })
  name: string;

  @ApiPropertyOptional({
    description:
      'Optional human-readable explanation of what this role is for.',
  })
  description?: string;

  @ApiProperty({
    description: 'Identifier of the member acting through this role.',
  })
  memberId: string;

  @ApiProperty({
    description: 'Identifier of the scope where this role has authority.',
  })
  scopeId: string;

  @ApiProperty({
    description: 'Scope entity describing where this role applies.',
    type: () => ScopeResponseDto,
  })
  scope: ScopeResponseDto;

  @ApiProperty({
    description: 'Permission entities bundled into this role.',
    type: () => [PermissionResponseDto],
  })
  permissions: Array<PermissionResponseDto>;

  @ApiProperty({
    description: 'Lifecycle state of the role.',
    enum: [
      'drafted',
      'under-review',
      'active',
      'suspended',
      'revoked',
      'expired',
    ],
  })
  state:
    'drafted' | 'under-review' | 'active' | 'suspended' | 'revoked' | 'expired';

  @ApiProperty({
    description: 'Timestamp when this role record was created.',
    format: 'date-time',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Timestamp when this role record was last updated.',
    format: 'date-time',
  })
  updatedAt: string;

  @ApiPropertyOptional({
    description: 'Optional timestamp after which this role no longer applies.',
    format: 'date-time',
  })
  expiresAt?: string;

  [key: string]: unknown;
}
