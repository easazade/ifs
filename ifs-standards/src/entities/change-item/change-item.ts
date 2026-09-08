// GENERATED FOR SCENARIO TESTING PURPOSES. DO NOT MODIFY BY HAND

export type ChangeItem = {
  [k: string]: unknown;
} & {
  /**
   * Globally unique identifier for this change item.
   */
  id: string;
  /**
   * IFS system identifier for this ChangeItem.
   */
  ifsId: string;
  /**
   * Entity type discriminator. Always "ChangeItem" for ChangeItem entities.
   */
  entityType: "ChangeItem";
  /**
   * Id of the object this object is derived from.
   */
  basedOn?: string;
  /**
   * URL for documentation about this entity.
   */
  entityDocumentationUrl: string;
  /**
   * Resource category for this change item, such as rule, scope, protocol, record, or resource.
   */
  resourceType: string;
  /**
   * Type of operation this item proposes for the target object.
   */
  operation: "update" | "create" | "delete" | "replace";
  /**
   * Stable IFS reference for the logical object being changed. Null for create operations where no active target exists yet.
   */
  targetRef: string | null;
  /**
   * IFS reference to the active version observed when the change item was authored. Used for conflict detection. Null for create operations.
   */
  baseRef: string | null;
  /**
   * IFS reference to the proposed object or version produced by this change item. Null for delete operations.
   */
  proposedRef: string | null;
  /**
   * Optional human-readable note explaining this specific item.
   */
  description?: string;
  /**
   * Timestamp when this change item was created.
   */
  createdAt: string;
  /**
   * Timestamp when this change item was last updated.
   */
  updatedAt: string;
  [k: string]: unknown;
};
