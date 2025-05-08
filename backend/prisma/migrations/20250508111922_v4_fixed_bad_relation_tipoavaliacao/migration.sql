/*
  Warnings:

  - You are about to drop the column `evento_idevento` on the `tipo_avalicao` table. All the data in the column will be lost.
  - Added the required column `tipoavalicao_idtipo_avalicao` to the `evento` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "tipo_avalicao" DROP CONSTRAINT "tipo_avalicao_evento_idevento_fkey";

-- AlterTable
ALTER TABLE "evento" ADD COLUMN     "tipoavalicao_idtipo_avalicao" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "tipo_avalicao" DROP COLUMN "evento_idevento";

-- AddForeignKey
ALTER TABLE "evento" ADD CONSTRAINT "evento_tipoavalicao_idtipo_avalicao_fkey" FOREIGN KEY ("tipoavalicao_idtipo_avalicao") REFERENCES "tipo_avalicao"("idtipo_avalicao") ON DELETE RESTRICT ON UPDATE CASCADE;
