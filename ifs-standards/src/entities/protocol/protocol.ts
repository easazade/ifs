// GENERATED FOR SCENARIO TESTING PURPOSES. DO NOT MODIFY BY HAND

export interface Protocol {
  /**
   * identifier protocol.
   */
  id: string;
  /**
   * IFS system identifier for this Protocol.
   */
  ifsId: string;
  /**
   * Entity type discriminator. Always "Protocol" for Protocol entities.
   */
  entityType: "Protocol";
  /**
   * Id of the object this object is derived from.
   */
  basedOn?: string;
  /**
   * URL for documentation about this entity.
   */
  entityDocumentationUrl: string;
  createdAt: string;
  [k: string]: unknown;
}
