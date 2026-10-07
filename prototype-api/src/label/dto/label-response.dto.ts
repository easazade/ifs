import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LabelResponseDto {
  @ApiProperty({
    description: 'Globally unique identifier for this label.',
    pattern: '^Label/[^/\\s]+$',
  })
  id: string;

  @ApiProperty({
    description:
      'Entity type discriminator. Always "Label" for Label entities.',
    enum: ['Label'],
  })
  entityType: 'Label';

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
    description: 'Timestamp when this label was created.',
    format: 'date-time',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Timestamp when this label was last updated.',
    format: 'date-time',
  })
  updatedAt: string;

  [key: string]: unknown;
}
