import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGeographicAreaDto {
  @ApiProperty({
    description: 'Globally unique identifier for this geographic area.',
  })
  id: string;

  @ApiProperty({
    description: 'IFS system identifier for this GeographicArea.',
  })
  ifsId: string;

  @ApiProperty({
    description: 'IFS entity category/type for this geographic area.',
  })
  entityType: string;

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
