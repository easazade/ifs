import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrganizationResponseDto {
  @ApiProperty({
    description: 'Globally unique identifier for this organization.',
    pattern: '^Organization/[^/\\s]+$',
  })
  id: string;

  @ApiProperty({
    description: 'IFS entity category/type for this organization.',
  })
  entityType: string;

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
