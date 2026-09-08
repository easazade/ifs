/**
 * Static protocol catalog for demos. In a real app this often comes from an API.
 */
// This UI summary is separate from the full generated Protocol entity.
export interface ProtocolSummary {
  id: string;
  title: string;
}

export const PROTOCOLS: ProtocolSummary[] = [
  { id: 'iso-22000', title: 'ISO 22000 — Food safety' },
  { id: 'brcgs-food', title: 'BRCGS Food Safety' },
  { id: 'ifs-food', title: 'IFS Food Standard' },
];

export function getProtocolById(id: string | undefined): ProtocolSummary | undefined {
  return PROTOCOLS.find((p) => p.id === id);
}
