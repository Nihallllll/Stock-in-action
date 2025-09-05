/*
  Warnings:

  - You are about to drop the column `boughtAt` on the `MintedToken` table. All the data in the column will be lost.
  - You are about to drop the column `symbol` on the `MintedToken` table. All the data in the column will be lost.
  - You are about to drop the column `lastprocessedblock` on the `User` table. All the data in the column will be lost.
  - The `status` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[userId,tokenAddress]` on the table `MintedToken` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."MintedToken" DROP COLUMN "boughtAt",
DROP COLUMN "symbol",
ADD COLUMN     "locked" BIGINT NOT NULL DEFAULT 0,
ALTER COLUMN "amount" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "lastprocessedblock",
ADD COLUMN     "lastProcessedBlock" BIGINT,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT;

-- DropEnum
DROP TYPE "public"."Status";

-- CreateTable
CREATE TABLE "public"."BorrowedToken" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "amount" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "BorrowedToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DepositedToken" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "tokenAddress" TEXT NOT NULL,
    "amount" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "DepositedToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BorrowedToken_userId_token_key" ON "public"."BorrowedToken"("userId", "token");

-- CreateIndex
CREATE UNIQUE INDEX "DepositedToken_userId_tokenAddress_key" ON "public"."DepositedToken"("userId", "tokenAddress");

-- CreateIndex
CREATE UNIQUE INDEX "MintedToken_userId_tokenAddress_key" ON "public"."MintedToken"("userId", "tokenAddress");

-- AddForeignKey
ALTER TABLE "public"."BorrowedToken" ADD CONSTRAINT "BorrowedToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DepositedToken" ADD CONSTRAINT "DepositedToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
