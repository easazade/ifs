import { ApiPropertyOptional } from '@nestjs/swagger';

export class NestedGeographicAreaDto {
  @ApiPropertyOptional({
    description:
      'Existing entity ID, or omit/use null or an empty string to create a new entity. An ID-only object links an existing entity; other supplied fields are merged or created.',
    nullable: true,
  })
  id?: string | null;

  @ApiPropertyOptional({
    description:
      'Entity type discriminator. Always "Geographic Area" for Geographic Area entities.',
    enum: ['Geographic Area'],
  })
  entityType?: 'Geographic Area';

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
    description: 'Timestamp when this geographic area record was last updated.',
    format: 'date-time',
  })
  updatedAt?: string;

  @ApiPropertyOptional({
    description:
      'Polygon geometries making up this area. Separate polygons can represent disconnected regions. Coordinates use [longitude, latitude, optional altitude] positions.',
    type: 'array',
    items: {
      type: 'array',
      description:
        'A polygon ring represented by coordinate positions; the first ring is the exterior boundary and subsequent rings, if any, are holes.',
      items: {
        type: 'array',
        minItems: 4,
        items: {
          type: 'array',
          minItems: 2,
          maxItems: 3,
          items: { type: 'number' },
        },
      },
    },
  })
  polygons?: Array<Array<Array<Array<number>>>>;

  [key: string]: unknown;
}
