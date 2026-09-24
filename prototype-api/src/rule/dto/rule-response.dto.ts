import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RuleResponseDto {
  @ApiProperty({ description: 'Globally unique identifier for this rule.' })
  id: string;

  @ApiProperty({ description: 'IFS system identifier for this Rule.' })
  ifsId: string;

  @ApiProperty({
    description: 'Entity category for this object, normally Rule.',
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
    description: 'Timestamp when this rule record was created.',
    format: 'date-time',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Timestamp when this rule record was last updated.',
    format: 'date-time',
  })
  updatedAt: string;

  [key: string]: unknown;
}
