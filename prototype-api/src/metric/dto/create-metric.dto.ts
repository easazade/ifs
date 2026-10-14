import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NestedMeasurementMethodDto } from '../../measurement-method/dto/nested-measurement-method.dto.js';
import { NestedMetricDto } from './nested-metric.dto.js';

export class CreateMetricDto {
  @ApiProperty({
    description: 'Globally unique identifier for this metric.',
    pattern: '^Metric/[^/\\s]+$',
    allOf: [
      {
        type: 'string',
        description: 'Globally unique entity identifier in EntityType/ID form.',
        pattern: '^[A-Z][A-Za-z0-9]*/[^/\\s]+$',
      },
      {
        type: 'string',
        description: 'Globally unique identifier for this metric.',
        pattern: '^Metric/[^/\\s]+$',
      },
    ],
  })
  id: string;

  @ApiProperty({
    description:
      'Entity type discriminator. Always "Metric" for Metric entities.',
    enum: ['Metric'],
  })
  entityType: 'Metric';

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

  @ApiPropertyOptional({
    description: 'Timestamp when this metric record was last updated.',
    format: 'date-time',
  })
  updatedAt?: string;

  @ApiProperty({ description: 'Name of the metric.' })
  name: string;

  @ApiProperty({ description: 'Description of the metric.' })
  description: string;

  @ApiProperty({
    description: 'Way in which measurement is performed.',
    enum: ['manual', 'function', 'intelligence'],
  })
  measurementWay: 'manual' | 'function' | 'intelligence';

  @ApiProperty({
    description: 'Type of measurement defined by this metric.',
    enum: ['count', 'ratio', 'rate', 'duration', 'score', 'composite'],
  })
  measurementType:
    'count' | 'ratio' | 'rate' | 'duration' | 'score' | 'composite';

  @ApiPropertyOptional({
    description:
      'Component metrics. Required for composite measurements; nonempty when supplied.',
    minItems: 1,
    type: () => [NestedMetricDto],
  })
  compositionItems?: Array<NestedMetricDto>;

  @ApiProperty({
    description: 'Method used to measure this metric.',
    type: () => NestedMeasurementMethodDto,
  })
  method: NestedMeasurementMethodDto;

  @ApiPropertyOptional({
    description:
      'IDs of entities to which this metric applies, in EntityType/ID form.',
    type: [String],
  })
  applicableEntityIds?: Array<string>;

  [key: string]: unknown;
}
