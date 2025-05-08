/*
  Warnings:

  - You are about to drop the column `status_evento_idstatus_evento` on the `evento` table. All the data in the column will be lost.
  - You are about to drop the `status_evento` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "evento" DROP CONSTRAINT "evento_status_evento_idstatus_evento_fkey";

-- AlterTable
ALTER TABLE "evento" DROP COLUMN "status_evento_idstatus_evento";

-- DropTable
DROP TABLE "status_evento";
