-- CreateEnum
CREATE TYPE "MergeOauthMethods" AS ENUM ('LINK_METHOD', 'RAISE_ERROR', 'ALLOW_DUPLICATES');

-- AlterTable
ALTER TABLE "ProjectConfig" ADD COLUMN     "mergeOauthMethods" "MergeOauthMethods" NOT NULL DEFAULT 'LINK_METHOD';
