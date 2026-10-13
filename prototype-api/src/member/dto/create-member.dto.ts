import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NestedPermissionDto } from '../../permission/dto/nested-permission.dto.js';

export class CreateMemberDto {
  @ApiProperty({
    description: 'Globally unique identifier for this member.',
    pattern: '^Member/[^/\\s]+$',
    allOf: [
      {
        type: 'string',
        description: 'Globally unique entity identifier in EntityType/ID form.',
        pattern: '^[A-Z][A-Za-z0-9]*/[^/\\s]+$',
      },
      {
        type: 'string',
        description: 'Globally unique identifier for this member.',
        pattern: '^Member/[^/\\s]+$',
      },
    ],
  })
  id: string;

  @ApiProperty({
    description:
      'Entity type discriminator. Always "Member" for Member entities.',
    enum: ['Member'],
  })
  entityType: 'Member';

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

  @ApiProperty({
    description: 'Label codes associated with this entity.',
    type: [String],
  })
  labelCodes: Array<string>;

  @ApiProperty({ description: 'Human-readable name of the member.' })
  name: string;

  @ApiProperty({ type: () => [NestedPermissionDto] })
  permissions: Array<NestedPermissionDto>;

  @ApiProperty({
    description: 'Whether this member is considered an owner of the system.',
  })
  isOwner: boolean;

  @ApiProperty({
    description: 'Timestamp when this member record was last updated.',
    format: 'date-time',
  })
  updatedAt: string;

  [key: string]: unknown;
}
