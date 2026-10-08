import { ApiPropertyOptional } from '@nestjs/swagger';

/** Equality filters are ANDed; endpoint paths refer to source (in) and target (out). */
export class RelationsQueryDto {
  @ApiPropertyOptional({
    enum: ['both', 'incoming', 'outgoing'],
    default: 'both',
    description: 'Which endpoint must match the requested object.',
  })
  direction?: 'both' | 'incoming' | 'outgoing';

  @ApiPropertyOptional({
    type: String,
    description:
      'JSON object of equality filters, ANDed together. Keys are relation fields or dotted endpoint fields (in.name, out.entityType). in/out, in.id/out.id and sourceId/targetId accept canonical EntityType/id strings. id accepts a canonical Relationship/id. Values are JSON values; null matches null, not missing fields.',
    example: '{"type":"has member","out.entityType":"Member"}',
  })
  filter?: string;
}
