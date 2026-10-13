import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMeasurementMethodDto {
  @ApiProperty({
    description: 'Globally unique identifier for this measurement method.',
    pattern: '^MeasurementMethod/[^/\\s]+$',
    allOf: [
      {
        type: 'string',
        description: 'Globally unique entity identifier in EntityType/ID form.',
        pattern: '^[A-Z][A-Za-z0-9]*/[^/\\s]+$',
      },
      {
        type: 'string',
        description: 'Globally unique identifier for this measurement method.',
        pattern: '^MeasurementMethod/[^/\\s]+$',
      },
    ],
  })
  id: string;

  @ApiProperty({
    description:
      'Entity type discriminator. Always "MeasurementMethod" for MeasurementMethod entities.',
    enum: ['MeasurementMethod'],
  })
  entityType: 'MeasurementMethod';

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
