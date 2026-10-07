// GENERATED FOR SCENARIO TESTING PURPOSES. DO NOT MODIFY BY HAND

export interface Label {
  /**
   * Globally unique identifier for this label.
   */
  id: string;
  /**
   * IFS system identifier for this Label.
   */
  ifsId: string;
  /**
   * Entity type discriminator. Always "Label" for Label entities.
   */
  entityType: "Label";
  /**
   * Id of the object this object is derived from.
   */
  basedOn?: string;
  /**
   * URL for documentation about this entity.
   */
  entityDocumentationUrl: string;
  /**
   * Timestamp when this label was created.
   */
  createdAt: string;
  /**
   * Timestamp when this label was last updated.
   */
  updatedAt: string;
  [k: string]: unknown;
}
