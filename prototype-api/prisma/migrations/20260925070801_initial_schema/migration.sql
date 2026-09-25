-- CreateTable
CREATE TABLE "Scope" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ifsId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "basedOn" TEXT,
    "entityDocumentationUrl" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "locations" JSONB,
    "groups" JSONB,
    "objects" JSONB,
    "entities" JSONB,
    "parentScopeId" TEXT,
    "childScopeIds" JSONB,
    "boundaryRules" JSONB,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL,
    "extensions" JSONB
);

-- CreateTable
CREATE TABLE "Action" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ifsId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "basedOn" TEXT,
    "entityDocumentationUrl" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "uniqueName" TEXT NOT NULL,
    "requiresPermission" BOOLEAN NOT NULL,
    "description" TEXT NOT NULL,
    "instructions" TEXT,
    "notes" TEXT,
    "warnings" TEXT,
    "state" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ifsId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "basedOn" TEXT,
    "entityDocumentationUrl" TEXT NOT NULL,
    "actionIds" JSONB NOT NULL,
    "memberId" TEXT,
    "roleId" TEXT,
    "scopeId" TEXT NOT NULL,
    "scope" JSONB,
    "state" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT,
    "expiresAt" TEXT NOT NULL,
    "extensions" JSONB
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ifsId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "basedOn" TEXT,
    "entityDocumentationUrl" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "memberId" TEXT NOT NULL,
    "scopeId" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL,
    "expiresAt" TEXT,
    "extensions" JSONB,
    CONSTRAINT "Role_scopeId_fkey" FOREIGN KEY ("scopeId") REFERENCES "Scope" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ifsId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityDocumentationUrl" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isOwner" BOOLEAN NOT NULL,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL,
    "extensions" JSONB
);

-- CreateTable
CREATE TABLE "ChangeItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ifsId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "basedOn" TEXT,
    "entityDocumentationUrl" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "operation" TEXT NOT NULL,
    "targetRef" TEXT,
    "baseRef" TEXT,
    "proposedRef" TEXT,
    "description" TEXT,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL,
    "extensions" JSONB
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ifsId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "basedOn" TEXT,
    "entityDocumentationUrl" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL,
    "extensions" JSONB
);

-- CreateTable
CREATE TABLE "Label" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ifsId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "basedOn" TEXT,
    "entityDocumentationUrl" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL,
    "extensions" JSONB
);

-- CreateTable
CREATE TABLE "Protocol" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ifsId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "basedOn" TEXT,
    "entityDocumentationUrl" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    "extensions" JSONB
);

-- CreateTable
CREATE TABLE "ReviewComment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ifsId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "basedOn" TEXT,
    "entityDocumentationUrl" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL,
    "extensions" JSONB
);

-- CreateTable
CREATE TABLE "Rule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ifsId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "basedOn" TEXT,
    "entityDocumentationUrl" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL,
    "extensions" JSONB
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ifsId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "basedOn" TEXT,
    "entityDocumentationUrl" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL,
    "decisionId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "previousRevisionId" TEXT,
    "extensions" JSONB
);

-- CreateTable
CREATE TABLE "Delegation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ifsId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "basedOn" TEXT,
    "entityDocumentationUrl" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT,
    "permissionId" TEXT NOT NULL,
    "permissionRelationId" TEXT,
    "delegatorRef" TEXT NOT NULL,
    "delegateRef" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "revokedAt" TEXT,
    "expiresAt" TEXT,
    "extensions" JSONB,
    CONSTRAINT "Delegation_permissionRelationId_fkey" FOREIGN KEY ("permissionRelationId") REFERENCES "Permission" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Decision" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ifsId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "basedOn" TEXT,
    "entityDocumentationUrl" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "previousRevisionId" TEXT,
    "eligibleMemberCount" INTEGER NOT NULL,
    "affectedMemberCount" INTEGER NOT NULL,
    "voteCount" INTEGER NOT NULL,
    "delegateVoteCount" INTEGER,
    "openedAt" TEXT NOT NULL,
    "closedAt" TEXT,
    "cancelledAt" TEXT,
    "verifiedAt" TEXT,
    "approvedAt" TEXT,
    "rejectedAt" TEXT,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL,
    "decidedAt" TEXT,
    "extensions" JSONB,
    CONSTRAINT "Decision_previousRevisionId_fkey" FOREIGN KEY ("previousRevisionId") REFERENCES "Decision" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Change" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ifsId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "basedOn" TEXT,
    "entityDocumentationUrl" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "summary" TEXT,
    "reason" TEXT NOT NULL,
    "decisionRelationId" TEXT,
    "commentsUrl" TEXT,
    "mainAuthorId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "diffUrl" TEXT,
    "number" INTEGER NOT NULL,
    "labels" JSONB,
    "merged" BOOLEAN NOT NULL,
    "hasConflict" BOOLEAN NOT NULL,
    "links" JSONB,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL,
    "mergedAt" TEXT,
    "closedAt" TEXT,
    "extensions" JSONB,
    CONSTRAINT "Change_decisionRelationId_fkey" FOREIGN KEY ("decisionRelationId") REFERENCES "Decision" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Change_mainAuthorId_fkey" FOREIGN KEY ("mainAuthorId") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_Permission_actions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_Permission_actions_A_fkey" FOREIGN KEY ("A") REFERENCES "Action" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_Permission_actions_B_fkey" FOREIGN KEY ("B") REFERENCES "Permission" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_Role_permissions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_Role_permissions_A_fkey" FOREIGN KEY ("A") REFERENCES "Permission" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_Role_permissions_B_fkey" FOREIGN KEY ("B") REFERENCES "Role" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_Member_roles" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_Member_roles_A_fkey" FOREIGN KEY ("A") REFERENCES "Member" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_Member_roles_B_fkey" FOREIGN KEY ("B") REFERENCES "Role" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_Member_permissions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_Member_permissions_A_fkey" FOREIGN KEY ("A") REFERENCES "Member" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_Member_permissions_B_fkey" FOREIGN KEY ("B") REFERENCES "Permission" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_Decision_eligibleMembers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_Decision_eligibleMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "Decision" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_Decision_eligibleMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "Member" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_Decision_affectedMembers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_Decision_affectedMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "Decision" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_Decision_affectedMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "Member" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_Decision_votes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_Decision_votes_A_fkey" FOREIGN KEY ("A") REFERENCES "Decision" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_Decision_votes_B_fkey" FOREIGN KEY ("B") REFERENCES "Vote" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_Decision_rules" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_Decision_rules_A_fkey" FOREIGN KEY ("A") REFERENCES "Decision" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_Decision_rules_B_fkey" FOREIGN KEY ("B") REFERENCES "Rule" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_Change_changes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_Change_changes_A_fkey" FOREIGN KEY ("A") REFERENCES "Change" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_Change_changes_B_fkey" FOREIGN KEY ("B") REFERENCES "ChangeItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_Change_comments" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_Change_comments_A_fkey" FOREIGN KEY ("A") REFERENCES "Change" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_Change_comments_B_fkey" FOREIGN KEY ("B") REFERENCES "Comment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_Change_reviewComments" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_Change_reviewComments_A_fkey" FOREIGN KEY ("A") REFERENCES "Change" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_Change_reviewComments_B_fkey" FOREIGN KEY ("B") REFERENCES "ReviewComment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_Change_authors" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_Change_authors_A_fkey" FOREIGN KEY ("A") REFERENCES "Change" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_Change_authors_B_fkey" FOREIGN KEY ("B") REFERENCES "Member" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_Change_reviewers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_Change_reviewers_A_fkey" FOREIGN KEY ("A") REFERENCES "Change" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_Change_reviewers_B_fkey" FOREIGN KEY ("B") REFERENCES "Member" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_Permission_actions_AB_unique" ON "_Permission_actions"("A", "B");

-- CreateIndex
CREATE INDEX "_Permission_actions_B_index" ON "_Permission_actions"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Role_permissions_AB_unique" ON "_Role_permissions"("A", "B");

-- CreateIndex
CREATE INDEX "_Role_permissions_B_index" ON "_Role_permissions"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Member_roles_AB_unique" ON "_Member_roles"("A", "B");

-- CreateIndex
CREATE INDEX "_Member_roles_B_index" ON "_Member_roles"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Member_permissions_AB_unique" ON "_Member_permissions"("A", "B");

-- CreateIndex
CREATE INDEX "_Member_permissions_B_index" ON "_Member_permissions"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Decision_eligibleMembers_AB_unique" ON "_Decision_eligibleMembers"("A", "B");

-- CreateIndex
CREATE INDEX "_Decision_eligibleMembers_B_index" ON "_Decision_eligibleMembers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Decision_affectedMembers_AB_unique" ON "_Decision_affectedMembers"("A", "B");

-- CreateIndex
CREATE INDEX "_Decision_affectedMembers_B_index" ON "_Decision_affectedMembers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Decision_votes_AB_unique" ON "_Decision_votes"("A", "B");

-- CreateIndex
CREATE INDEX "_Decision_votes_B_index" ON "_Decision_votes"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Decision_rules_AB_unique" ON "_Decision_rules"("A", "B");

-- CreateIndex
CREATE INDEX "_Decision_rules_B_index" ON "_Decision_rules"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Change_changes_AB_unique" ON "_Change_changes"("A", "B");

-- CreateIndex
CREATE INDEX "_Change_changes_B_index" ON "_Change_changes"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Change_comments_AB_unique" ON "_Change_comments"("A", "B");

-- CreateIndex
CREATE INDEX "_Change_comments_B_index" ON "_Change_comments"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Change_reviewComments_AB_unique" ON "_Change_reviewComments"("A", "B");

-- CreateIndex
CREATE INDEX "_Change_reviewComments_B_index" ON "_Change_reviewComments"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Change_authors_AB_unique" ON "_Change_authors"("A", "B");

-- CreateIndex
CREATE INDEX "_Change_authors_B_index" ON "_Change_authors"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Change_reviewers_AB_unique" ON "_Change_reviewers"("A", "B");

-- CreateIndex
CREATE INDEX "_Change_reviewers_B_index" ON "_Change_reviewers"("B");
