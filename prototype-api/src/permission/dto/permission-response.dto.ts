import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ActionResponseDto } from '../../action/dto/action-response.dto.js';

export class PermissionResponseDto {
  @ApiProperty({
    description: 'Globally unique identifier for this permission.',
  })
  id: string;

  @ApiProperty({ description: 'IFS system identifier for this Permission.' })
  ifsId: string;

  @ApiProperty({
    description:
      'Entity type discriminator. Always "Permission" for Permission entities.',
    enum: ['Permission'],
  })
  entityType: 'Permission';

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
    description: 'ID list of actions that this permission allows',
    type: [String],
  })
  actionIds: Array<string>;

  @ApiPropertyOptional({
    description: 'List of actions that this permission allows',
    type: () => [ActionResponseDto],
  })
  actions?: Array<ActionResponseDto>;

  @ApiPropertyOptional({
    description: 'Identifier of the member receiving this permission.',
  })
  memberId?: string;

  @ApiPropertyOptional({
    description: 'Identifier of the role receiving this permission.',
  })
  roleId?: string;

  @ApiProperty({
    description:
      'Identifier of the scope object where this permission applies.',
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

  @ApiProperty({
    description: 'Timestamp when this permission record was created.',
    format: 'date-time',
  })
  createdAt: string;

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
