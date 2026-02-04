-- DropIndex
DROP INDEX "user_auth_providers_userId_idx";

-- CreateIndex
CREATE INDEX "user_auth_providers_userId_provider_idx" ON "user_auth_providers"("userId", "provider");
