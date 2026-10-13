import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProtocolResponseDto {
  @ApiProperty({
    description: 'identifier protocol.',
    pattern: '^Protocol/[^/\\s]+$',
    allOf: [
      {
        type: 'string',
        description: 'Globally unique entity identifier in EntityType/ID form.',
        pattern: '^[A-Z][A-Za-z0-9]*/[^/\\s]+$',
      },
      {
        type: 'string',
        description: 'identifier protocol.',
        pattern: '^Protocol/[^/\\s]+$',
      },
    ],
  })
  id: string;

  @ApiProperty({
    description:
      'Entity type discriminator. Always "Protocol" for Protocol entities.',
    enum: ['Protocol'],
  })
  entityType: 'Protocol';

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

  [key: string]: unknown;
}
