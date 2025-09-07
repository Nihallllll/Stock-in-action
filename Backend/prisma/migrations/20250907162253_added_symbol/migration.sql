/*
  Warnings:

  - Added the required column `symbol` to the `DepositedToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `symbol` to the `MintedToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."DepositedToken" ADD COLUMN     "symbol" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."MintedToken" ADD COLUMN     "symbol" TEXT NOT NULL;
