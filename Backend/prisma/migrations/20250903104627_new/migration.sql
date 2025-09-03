/*
  Warnings:

  - You are about to drop the column `bougthAt` on the `MintedToken` table. All the data in the column will be lost.
  - Added the required column `tokenAddress` to the `MintedToken` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('Good', 'Bad');

-- AlterTable
ALTER TABLE "public"."MintedToken" DROP COLUMN "bougthAt",
ADD COLUMN     "boughtAt" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "tokenAddress" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "status" "public"."Status" NOT NULL DEFAULT 'Good';
