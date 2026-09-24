import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLabelDto {
  @ApiProperty({ description: 'Globally unique identifier for this label.' })
  id: string;

  @ApiProperty({ description: 'IFS system identifier for this Label.' })
  ifsId: string;

  @ApiProperty({
    description:
      'Entity type discriminator. Always "Label" for Label entities.',
    enum: ['Label'],
  })
  entityType: 'Label';

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
