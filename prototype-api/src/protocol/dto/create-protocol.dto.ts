import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProtocolDto {
  @ApiProperty({ description: 'identifier protocol.' })
  id: string;

  @ApiProperty({ description: 'IFS system identifier for this Protocol.' })
  ifsId: string;

  @ApiProperty({
    description:
      'Entity type discriminator. Always "Protocol" for Protocol entities.',
    enum: ['Protocol'],
  })
  entityType: 'Protocol';

  @ApiPropertyOptional({
    description: 'Id of the object this object is derived from.',
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
