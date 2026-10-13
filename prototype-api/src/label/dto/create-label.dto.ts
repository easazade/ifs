import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLabelDto {
  @ApiProperty({
    description: 'Globally unique identifier for this label.',
    pattern: '^Label/[^/\\s]+$',
    allOf: [
      {
        type: 'string',
        description: 'Globally unique entity identifier in EntityType/ID form.',
        pattern: '^[A-Z][A-Za-z0-9]*/[^/\\s]+$',
      },
      {
        type: 'string',
        description: 'Globally unique identifier for this label.',
        pattern: '^Label/[^/\\s]+$',
      },
    ],
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

  @ApiProperty({ description: 'Name of this label.' })
  name: string;

  @ApiProperty({ description: 'Descriptive text for this label.' })
  description: string;

  @ApiPropertyOptional({ description: 'Display color for this label.' })
  color?: string;

  @ApiPropertyOptional({ description: 'Code for this label.' })
  code?: string;

  @ApiProperty({
    description: 'Timestamp when this label was last updated.',
    format: 'date-time',
  })
  updatedAt: string;

  [key: string]: unknown;
}
