import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MemberResponseDto } from '../../member/dto/member-response.dto.js';
import { OrganizationResponseDto } from '../../organization/dto/organization-response.dto.js';

export class GroupResponseDto {
  @ApiProperty({
    description: 'Globally unique identifier for this group.',
    pattern: '^Group/[^/\\s]+$',
  })
  id: string;

  @ApiProperty({
    description:
      'Entity type discriminator. Always "Group" for Group entities.',
    enum: ['Group'],
  })
  entityType: 'Group';

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
    description: 'Human-readable name of this group.',
    minLength: 1,
  })
  name: string;

  @ApiPropertyOptional({ description: 'Purpose and context of this group.' })
  description?: string;

  @ApiPropertyOptional({
    description:
      'Members directly belonging to this group. Membership alone does not grant delegated authority.',
    type: () => [MemberResponseDto],
  })
  members?: Array<MemberResponseDto>;

  @ApiPropertyOptional({
    description:
      'Organizations directly belonging to this group. Inclusion alone does not grant delegated authority.',
    type: () => [OrganizationResponseDto],
  })
  organizations?: Array<OrganizationResponseDto>;

  @ApiPropertyOptional({
    description:
      'Subgroups directly belonging to this group. Containment alone does not grant delegated authority or imply transitive membership.',
    type: () => [GroupResponseDto],
  })
  groups?: Array<GroupResponseDto>;

  @ApiProperty({
    description: 'Timestamp when this group record was created.',
    format: 'date-time',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Timestamp when this group record was last updated.',
    format: 'date-time',
  })
  updatedAt: string;

  [key: string]: unknown;
}
