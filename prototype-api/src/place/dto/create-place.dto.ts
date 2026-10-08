import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GeographicAreaResponseDto } from '../../geographic-area/dto/geographic-area-response.dto.js';
import { RoleResponseDto } from '../../role/dto/role-response.dto.js';

export class CreatePlaceDto {
  @ApiProperty({
    description: 'Globally unique identifier for this place.',
    pattern: '^Place/[^/\\s]+$',
  })
  id: string;

  @ApiProperty({
    description:
      'Entity type discriminator. Always "Place" for Place entities.',
    enum: ['Place'],
  })
  entityType: 'Place';

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
    description: 'Timestamp when this place record was created.',
    format: 'date-time',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Timestamp when this place record was last updated.',
    format: 'date-time',
  })
  updatedAt: string;

  @ApiProperty({ description: 'Human-readable name of the real-world place.' })
  name: string;

  @ApiProperty({
    description:
      'Optional latitude, longitude, and altitude location, represented as a comma-separated string.',
  })
  coordinate: string;

  @ApiPropertyOptional({
    description:
      'Geographic area occupied by this place, including disconnected areas when applicable.',
    type: () => GeographicAreaResponseDto,
  })
  geographicArea?: GeographicAreaResponseDto;

  @ApiPropertyOptional({
    description:
      'Role entities held by parties with responsibilities or authority regarding this place, such as stewardship, protection, management, improvement, construction, promotion, etc.',
    type: () => [RoleResponseDto],
  })
  roles?: Array<RoleResponseDto>;

  [key: string]: unknown;
}
