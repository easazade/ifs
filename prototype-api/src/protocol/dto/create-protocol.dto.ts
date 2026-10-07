import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProtocolDto {
  @ApiProperty({
    description: 'identifier protocol.',
    pattern: '^Protocol/[^/\\s]+$',
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
    description: 'URL for documentation about this entity.',
    format: 'uri',
  })
  entityDocumentationUrl: string;

  @ApiProperty({ format: 'date-time' })
  createdAt: string;

  [key: string]: unknown;
}
