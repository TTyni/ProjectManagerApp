/*
  Warnings:

  - Added the required column `role` to the `ProjectUsers` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('viewer', 'manager', 'editor');

-- AlterTable
ALTER TABLE "ProjectUsers" ADD COLUMN     "role" "Role" NOT NULL;
