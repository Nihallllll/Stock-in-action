/*
  Warnings:

  - Added the required column `bougthAt` to the `MintedToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."MintedToken" ADD COLUMN     "bougthAt" BIGINT NOT NULL;
