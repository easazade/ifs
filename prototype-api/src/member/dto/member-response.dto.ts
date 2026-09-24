import { ApiProperty } from '@nestjs/swagger';
import { PermissionResponseDto } from '../../permission/dto/permission-response.dto.js';
import { RoleResponseDto } from '../../role/dto/role-response.dto.js';

export class MemberResponseDto {
  @ApiProperty({ description: 'Globally unique identifier for this member.' })
  id: string;

  @ApiProperty({ description: 'IFS system identifier for this Member.' })
  ifsId: string;

  @ApiProperty({
    description:
      'Entity type discriminator. Always "Member" for Member entities.',
    enum: ['Member'],
  })
  entityType: 'Member';

  @ApiProperty({
    description: 'URL for documentation about this entity.',
    format: 'uri',
  })
  entityDocumentationUrl: string;

  @ApiProperty({ description: 'Human-readable name of the member.' })
  name: string;

  @ApiProperty({ readOnly: true, type: () => [RoleResponseDto] })
  roles: Array<RoleResponseDto>;

  @ApiProperty({ type: () => [PermissionResponseDto] })
  permissions: Array<PermissionResponseDto>;

  @ApiProperty({
    description: 'Whether this member is considered an owner of the system.',
  })
  isOwner: boolean;

  @ApiProperty({
    description: 'Timestamp when this member record was created.',
    format: 'date-time',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Timestamp when this member record was last updated.',
    format: 'date-time',
  })
  updatedAt: string;

  [key: string]: unknown;
}
