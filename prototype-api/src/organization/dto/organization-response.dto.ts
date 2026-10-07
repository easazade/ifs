import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrganizationResponseDto {
  @ApiProperty({
    description: 'Globally unique identifier for this organization.',
  })
  id: string;

  @ApiProperty({ description: 'IFS system identifier for this Organization.' })
  ifsId: string;

  @ApiProperty({
    description: 'IFS entity category/type for this organization.',
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
    description: 'Timestamp when this organization record was created.',
    format: 'date-time',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Timestamp when this organization record was last updated.',
    format: 'date-time',
  })
  updatedAt: string;

  [key: string]: unknown;
}
