import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RuleResponseDto {
  @ApiProperty({
    description: 'Globally unique identifier for this rule.',
    pattern: '^Rule/[^/\\s]+$',
  })
  id: string;

  @ApiProperty({
    description: 'Entity type discriminator. Always "Rule" for Rule entities.',
    enum: ['Rule'],
  })
  entityType: 'Rule';

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
