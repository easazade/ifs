import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRuleDto {
  @ApiProperty({
    description: 'Globally unique identifier for this rule.',
    pattern: '^Rule/[^/\\s]+$',
    allOf: [
      {
        type: 'string',
        description: 'Globally unique entity identifier in EntityType/ID form.',
        pattern: '^[A-Z][A-Za-z0-9]*/[^/\\s]+$',
      },
      {
        type: 'string',
        description: 'Globally unique identifier for this rule.',
        pattern: '^Rule/[^/\\s]+$',
      },
    ],
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

  @ApiPropertyOptional({
    description: 'Label codes associated with this entity.',
    type: [String],
  })
  labelCodes?: Array<string>;

  @ApiProperty({
    description: 'Timestamp when this rule record was last updated.',
    format: 'date-time',
  })
  updatedAt: string;

  [key: string]: unknown;
}
