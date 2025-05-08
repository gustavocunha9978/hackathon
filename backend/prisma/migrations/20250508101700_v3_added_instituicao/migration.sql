/*
  Warnings:

  - Added the required column `instituicao_idinstituicao` to the `evento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instituicao_idinstituicao` to the `usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "evento" ADD COLUMN     "instituicao_idinstituicao" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "usuario" ADD COLUMN     "instituicao_idinstituicao" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "instituicao" (
    "idinstituicao" SERIAL NOT NULL,
    "nome" VARCHAR(200) NOT NULL,
    "prefixo_email" VARCHAR(100) NOT NULL,

    CONSTRAINT "instituicao_pkey" PRIMARY KEY ("idinstituicao")
);

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_instituicao_idinstituicao_fkey" FOREIGN KEY ("instituicao_idinstituicao") REFERENCES "instituicao"("idinstituicao") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evento" ADD CONSTRAINT "evento_instituicao_idinstituicao_fkey" FOREIGN KEY ("instituicao_idinstituicao") REFERENCES "instituicao"("idinstituicao") ON DELETE RESTRICT ON UPDATE CASCADE;
