import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGeographicAreaDto {
  @ApiProperty({
    description: 'Globally unique identifier for this geographic area.',
    pattern: '^GeographicArea/[^/\\s]+$',
  })
  id: string;

  @ApiProperty({
    description:
      'Entity type discriminator. Always "Geographic Area" for Geographic Area entities.',
    enum: ['Geographic Area'],
  })
  entityType: 'Geographic Area';

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
    description: 'Timestamp when this geographic area record was created.',
    format: 'date-time',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Timestamp when this geographic area record was last updated.',
    format: 'date-time',
  })
  updatedAt: string;

  @ApiProperty({
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
  polygons: Array<Array<Array<Array<number>>>>;

  [key: string]: unknown;
}
