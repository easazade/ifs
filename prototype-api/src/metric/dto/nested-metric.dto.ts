import { ApiPropertyOptional } from '@nestjs/swagger';
import { NestedMeasurementMethodDto } from '../../measurement-method/dto/nested-measurement-method.dto.js';

export class NestedMetricDto {
  @ApiPropertyOptional({
    description:
      'Existing entity ID, or omit/use null or an empty string to create a new entity. An ID-only object links an existing entity; other supplied fields are merged or created.',
    nullable: true,
  })
  id?: string | null;

  @ApiPropertyOptional({
    description:
      'Entity type discriminator. Always "Metric" for Metric entities.',
    enum: ['Metric'],
  })
  entityType?: 'Metric';

  @ApiPropertyOptional({
    description: 'Id of the object this object is derived from.',
    pattern: '^[A-Z][A-Za-z0-9]*/[^/\\s]+$',
  })
  basedOn?: string;

  @ApiPropertyOptional({
    description: 'URL for documentation about this entity type.',
    format: 'uri',
  })
  entityDocumentationUrl?: string;

  @ApiPropertyOptional({
    description: 'URL for documentation about this object instance',
    format: 'uri',
  })
  documentationUrl?: string;

  @ApiPropertyOptional({
    description: 'Timestamp when this entity record was created.',
    format: 'date-time',
  })
  createdAt?: string;

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

  @ApiPropertyOptional({ description: 'Name of the metric.' })
  name?: string;

  @ApiPropertyOptional({ description: 'Description of the metric.' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Way in which measurement is performed.',
    enum: ['manual', 'function', 'intelligence'],
  })
  measurementWay?: 'manual' | 'function' | 'intelligence';

  @ApiPropertyOptional({
    description: 'Type of measurement defined by this metric.',
    enum: ['count', 'ratio', 'rate', 'duration', 'score', 'composite'],
  })
  measurementType?:
    'count' | 'ratio' | 'rate' | 'duration' | 'score' | 'composite';

  @ApiPropertyOptional({
    description:
      'Component metrics. Required for composite measurements; nonempty when supplied.',
    minItems: 1,
    type: () => [NestedMetricDto],
  })
  compositionItems?: Array<NestedMetricDto>;

  @ApiPropertyOptional({
    description: 'Method used to measure this metric.',
    type: () => NestedMeasurementMethodDto,
  })
  method?: NestedMeasurementMethodDto;

  @ApiPropertyOptional({
    description:
      'IDs of entities to which this metric applies, in EntityType/ID form.',
    type: [String],
  })
  applicableEntityIds?: Array<string>;

  [key: string]: unknown;
}
