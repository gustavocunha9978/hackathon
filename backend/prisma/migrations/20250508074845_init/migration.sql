-- CreateTable
CREATE TABLE "status_artigo" (
    "idstatus_artigo" SERIAL NOT NULL,
    "descricao" VARCHAR(45) NOT NULL,

    CONSTRAINT "status_artigo_pkey" PRIMARY KEY ("idstatus_artigo")
);

-- CreateTable
CREATE TABLE "artigo" (
    "idartigo" SERIAL NOT NULL,
    "titulo" VARCHAR(45) NOT NULL,
    "resumo" VARCHAR(45) NOT NULL,
    "area_tematica" VARCHAR(45) NOT NULL,
    "status_artigo_idstatus_artigo" INTEGER NOT NULL,

    CONSTRAINT "artigo_pkey" PRIMARY KEY ("idartigo")
);

-- CreateTable
CREATE TABLE "usuario" (
    "idusuario" SERIAL NOT NULL,
    "email" VARCHAR(45) NOT NULL,
    "senha" VARCHAR(255) NOT NULL,
    "nome" VARCHAR(45) NOT NULL,
    "data_nascimento" VARCHAR(45) NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("idusuario")
);

-- CreateTable
CREATE TABLE "autor_artigo" (
    "usuario_idusuario" INTEGER NOT NULL,
    "artigo_idartigo" INTEGER NOT NULL,

    CONSTRAINT "autor_artigo_pkey" PRIMARY KEY ("usuario_idusuario","artigo_idartigo")
);

-- CreateTable
CREATE TABLE "versao_artigo" (
    "idversao_artigo" SERIAL NOT NULL,
    "versao" VARCHAR(45) NOT NULL,
    "data_cadastro" VARCHAR(45) NOT NULL,
    "artigo_idartigo" INTEGER NOT NULL,
    "caminho_pdf" VARCHAR(255),

    CONSTRAINT "versao_artigo_pkey" PRIMARY KEY ("idversao_artigo")
);

-- CreateTable
CREATE TABLE "avaliacao" (
    "idavaliacao" SERIAL NOT NULL,
    "nota" VARCHAR(45) NOT NULL,
    "observacao" VARCHAR(255) NOT NULL,
    "data_avaliacao" VARCHAR(45) NOT NULL,
    "caminho_pdf" VARCHAR(255),
    "usuario_idusuario" INTEGER NOT NULL,
    "versao_artigo_idversao_artigo" INTEGER NOT NULL,

    CONSTRAINT "avaliacao_pkey" PRIMARY KEY ("idavaliacao")
);

-- CreateTable
CREATE TABLE "cargo" (
    "idcargo" SERIAL NOT NULL,
    "nome" VARCHAR(45) NOT NULL,

    CONSTRAINT "cargo_pkey" PRIMARY KEY ("idcargo")
);

-- CreateTable
CREATE TABLE "cargo_usuario" (
    "cargo_idcargo" INTEGER NOT NULL,
    "usuario_idusuario" INTEGER NOT NULL,

    CONSTRAINT "cargo_usuario_pkey" PRIMARY KEY ("cargo_idcargo","usuario_idusuario")
);

-- CreateTable
CREATE TABLE "comentario" (
    "idcomentario" SERIAL NOT NULL,
    "descricao" VARCHAR(255) NOT NULL,
    "versao_artigo_idversao_artigo" INTEGER NOT NULL,
    "usuario_idusuario" INTEGER NOT NULL,

    CONSTRAINT "comentario_pkey" PRIMARY KEY ("idcomentario")
);

-- CreateTable
CREATE TABLE "status_evento" (
    "idstatus_evento" SERIAL NOT NULL,
    "descricao" VARCHAR(45) NOT NULL,

    CONSTRAINT "status_evento_pkey" PRIMARY KEY ("idstatus_evento")
);

-- CreateTable
CREATE TABLE "evento" (
    "idevento" SERIAL NOT NULL,
    "nome" VARCHAR(45) NOT NULL,
    "banner" VARCHAR(255) NOT NULL,
    "descricao" VARCHAR(255) NOT NULL,
    "data_inicio" VARCHAR(45) NOT NULL,
    "data_fim" VARCHAR(45) NOT NULL,
    "status_evento_idstatus_evento" INTEGER NOT NULL,

    CONSTRAINT "evento_pkey" PRIMARY KEY ("idevento")
);

-- CreateTable
CREATE TABLE "tipo_avalicao" (
    "idtipo_avalicao" SERIAL NOT NULL,
    "nome" VARCHAR(45) NOT NULL,
    "evento_idevento" INTEGER NOT NULL,

    CONSTRAINT "tipo_avalicao_pkey" PRIMARY KEY ("idtipo_avalicao")
);

-- CreateTable
CREATE TABLE "checklist_evento" (
    "idchecklist_evento" SERIAL NOT NULL,
    "evento_idevento" INTEGER NOT NULL,

    CONSTRAINT "checklist_evento_pkey" PRIMARY KEY ("idchecklist_evento")
);

-- CreateTable
CREATE TABLE "pergunta" (
    "idpergunta" SERIAL NOT NULL,
    "descricao" VARCHAR(255) NOT NULL,
    "checklist_evento_idchecklist_evento" INTEGER NOT NULL,

    CONSTRAINT "pergunta_pkey" PRIMARY KEY ("idpergunta")
);

-- CreateTable
CREATE TABLE "pergunta_artigo" (
    "idpergunta_artigo" SERIAL NOT NULL,
    "checked" VARCHAR(45) NOT NULL,
    "pergunta_idpergunta" INTEGER NOT NULL,
    "versao_artigo_idversao_artigo" INTEGER NOT NULL,

    CONSTRAINT "pergunta_artigo_pkey" PRIMARY KEY ("idpergunta_artigo")
);

-- CreateTable
CREATE TABLE "evento_avaliador" (
    "evento_idevento" INTEGER NOT NULL,
    "usuario_idusuario" INTEGER NOT NULL,

    CONSTRAINT "evento_avaliador_pkey" PRIMARY KEY ("evento_idevento","usuario_idusuario")
);

-- CreateTable
CREATE TABLE "palavra_artigo" (
    "idpalavra_artigo" SERIAL NOT NULL,
    "nome" VARCHAR(45) NOT NULL,
    "artigo_idartigo" INTEGER NOT NULL,

    CONSTRAINT "palavra_artigo_pkey" PRIMARY KEY ("idpalavra_artigo")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- AddForeignKey
ALTER TABLE "artigo" ADD CONSTRAINT "artigo_status_artigo_idstatus_artigo_fkey" FOREIGN KEY ("status_artigo_idstatus_artigo") REFERENCES "status_artigo"("idstatus_artigo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "autor_artigo" ADD CONSTRAINT "autor_artigo_usuario_idusuario_fkey" FOREIGN KEY ("usuario_idusuario") REFERENCES "usuario"("idusuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "autor_artigo" ADD CONSTRAINT "autor_artigo_artigo_idartigo_fkey" FOREIGN KEY ("artigo_idartigo") REFERENCES "artigo"("idartigo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "versao_artigo" ADD CONSTRAINT "versao_artigo_artigo_idartigo_fkey" FOREIGN KEY ("artigo_idartigo") REFERENCES "artigo"("idartigo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacao" ADD CONSTRAINT "avaliacao_usuario_idusuario_fkey" FOREIGN KEY ("usuario_idusuario") REFERENCES "usuario"("idusuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacao" ADD CONSTRAINT "avaliacao_versao_artigo_idversao_artigo_fkey" FOREIGN KEY ("versao_artigo_idversao_artigo") REFERENCES "versao_artigo"("idversao_artigo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cargo_usuario" ADD CONSTRAINT "cargo_usuario_cargo_idcargo_fkey" FOREIGN KEY ("cargo_idcargo") REFERENCES "cargo"("idcargo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cargo_usuario" ADD CONSTRAINT "cargo_usuario_usuario_idusuario_fkey" FOREIGN KEY ("usuario_idusuario") REFERENCES "usuario"("idusuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentario" ADD CONSTRAINT "comentario_versao_artigo_idversao_artigo_fkey" FOREIGN KEY ("versao_artigo_idversao_artigo") REFERENCES "versao_artigo"("idversao_artigo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentario" ADD CONSTRAINT "comentario_usuario_idusuario_fkey" FOREIGN KEY ("usuario_idusuario") REFERENCES "usuario"("idusuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evento" ADD CONSTRAINT "evento_status_evento_idstatus_evento_fkey" FOREIGN KEY ("status_evento_idstatus_evento") REFERENCES "status_evento"("idstatus_evento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tipo_avalicao" ADD CONSTRAINT "tipo_avalicao_evento_idevento_fkey" FOREIGN KEY ("evento_idevento") REFERENCES "evento"("idevento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklist_evento" ADD CONSTRAINT "checklist_evento_evento_idevento_fkey" FOREIGN KEY ("evento_idevento") REFERENCES "evento"("idevento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pergunta" ADD CONSTRAINT "pergunta_checklist_evento_idchecklist_evento_fkey" FOREIGN KEY ("checklist_evento_idchecklist_evento") REFERENCES "checklist_evento"("idchecklist_evento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pergunta_artigo" ADD CONSTRAINT "pergunta_artigo_pergunta_idpergunta_fkey" FOREIGN KEY ("pergunta_idpergunta") REFERENCES "pergunta"("idpergunta") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pergunta_artigo" ADD CONSTRAINT "pergunta_artigo_versao_artigo_idversao_artigo_fkey" FOREIGN KEY ("versao_artigo_idversao_artigo") REFERENCES "versao_artigo"("idversao_artigo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evento_avaliador" ADD CONSTRAINT "evento_avaliador_evento_idevento_fkey" FOREIGN KEY ("evento_idevento") REFERENCES "evento"("idevento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evento_avaliador" ADD CONSTRAINT "evento_avaliador_usuario_idusuario_fkey" FOREIGN KEY ("usuario_idusuario") REFERENCES "usuario"("idusuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "palavra_artigo" ADD CONSTRAINT "palavra_artigo_artigo_idartigo_fkey" FOREIGN KEY ("artigo_idartigo") REFERENCES "artigo"("idartigo") ON DELETE RESTRICT ON UPDATE CASCADE;
