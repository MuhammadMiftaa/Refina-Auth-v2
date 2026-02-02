-- DropIndex
DROP INDEX "users_email_idx";

-- CreateIndex
CREATE INDEX "users_email_deletedAt_idx" ON "users"("email", "deletedAt");
