// Database representation metadata; the public schema stays database-agnostic.
export const graphEdges = {
  relationship: {
    source: 'sourceId',
    target: 'targetId',
    immutable: ['sourceId', 'targetId'],
  },
} as const;
