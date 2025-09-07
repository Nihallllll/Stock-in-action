/*
  Warnings:

  - Added the required column `boughtAt` to the `DepositedToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."DepositedToken" ADD COLUMN     "boughtAt" BIGINT NOT NULL;
