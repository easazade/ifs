// GENERATED FOR SCENARIO TESTING PURPOSES. DO NOT MODIFY BY HAND

export interface Action {
  /**
   * Globally unique identifier for this action.
   */
  id: string;
  /**
   * IFS system identifier for this Action.
   */
  ifsId: string;
  /**
   * Entity category for this object, normally Action.
   */
  entityType: string;
  /**
   * Id of the object this object is derived from.
   */
  basedOn?: string;
  /**
   * URL for documentation about this entity.
   */
  entityDocumentationUrl: string;
  /**
   * Timestamp when this action record was created.
   */
  createdAt: string;
  /**
   * Timestamp when this action record was last updated.
   */
  updatedAt: string;
  /**
   * Human-readable name of the action.
   */
  name: string;
  /**
   * Stable unique name used by IFS implementations to identify this action.
   */
  uniqueName: string;
  /**
   * Whether a member or role must hold an applicable permission before performing this action.
   */
  requiresPermission: boolean;
  /**
   * Describes the action.
   */
  description: string;
  /**
   * Instructions for how to perform the action.
   */
  instructions?: string;
  /**
   * Additional notes about this action.
   */
  notes?: string;
  /**
   * Warnings, risks, or constraints to review before performing this action.
   */
  warnings?: string;
  /**
   * Lifecycle state of the action.
   */
  state: "drafted" | "under-review" | "active" | "suspended" | "revoked" | "deprecated";
}
