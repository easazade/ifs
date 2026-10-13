import { ApiPropertyOptional } from '@nestjs/swagger';
import { NestedGeographicAreaDto } from '../../geographic-area/dto/nested-geographic-area.dto.js';
import { NestedRoleDto } from '../../role/dto/nested-role.dto.js';

export class NestedPlaceDto {
  @ApiPropertyOptional({
    description:
      'Existing entity ID, or omit/use null or an empty string to create a new entity. An ID-only object links an existing entity; other supplied fields are merged or created.',
    nullable: true,
  })
  id?: string | null;

  @ApiPropertyOptional({
    description:
      'Entity type discriminator. Always "Place" for Place entities.',
    enum: ['Place'],
  })
  entityType?: 'Place';

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
    description: 'Timestamp when this place record was last updated.',
    format: 'date-time',
  })
  updatedAt?: string;

  @ApiPropertyOptional({
    description: 'Human-readable name of the real-world place.',
  })
  name?: string;

  @ApiPropertyOptional({
    description:
      'Optional latitude, longitude, and altitude location, represented as a comma-separated string.',
  })
  coordinate?: string;

  @ApiPropertyOptional({
    description:
      'Geographic area occupied by this place, including disconnected areas when applicable.',
    type: () => NestedGeographicAreaDto,
  })
  geographicArea?: NestedGeographicAreaDto;

  @ApiPropertyOptional({
    description:
      'Role entities held by parties with responsibilities or authority regarding this place, such as stewardship, protection, management, improvement, construction, promotion, etc.',
    type: () => [NestedRoleDto],
  })
  roles?: Array<NestedRoleDto>;

  [key: string]: unknown;
}
