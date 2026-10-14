import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ForumResponseDto {
  @ApiProperty({
    description: 'Globally unique identifier for this forum.',
    pattern: '^Forum/[^/\\s]+$',
    allOf: [
      {
        type: 'string',
        description: 'Globally unique entity identifier in EntityType/ID form.',
        pattern: '^[A-Z][A-Za-z0-9]*/[^/\\s]+$',
      },
      {
        type: 'string',
        description: 'Globally unique identifier for this forum.',
        pattern: '^Forum/[^/\\s]+$',
      },
    ],
  })
  id: string;

  @ApiProperty({
    description:
      'Entity type discriminator. Always "Forum" for Forum entities.',
    enum: ['Forum'],
  })
  entityType: 'Forum';

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
    description: 'Human-readable name of this forum.',
    minLength: 1,
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Purpose and scope of discussion in this forum.',
  })
  description?: string;

  [key: string]: unknown;
}
