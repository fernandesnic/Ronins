-- CreateTable
CREATE TABLE "perfis" (
    "id" TEXT NOT NULL,
    "nome" TEXT,
    "email" TEXT NOT NULL,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "is_socio" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "perfis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enderecos" (
    "id" SERIAL NOT NULL,
    "cep" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "rua" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "perfil_id" TEXT NOT NULL,

    CONSTRAINT "enderecos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produtos" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,
    "tamanho" TEXT,
    "descricao" TEXT,

    CONSTRAINT "produtos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendas" (
    "id" SERIAL NOT NULL,
    "forma_pagamento" TEXT NOT NULL,
    "preco_final" DOUBLE PRECISION NOT NULL,
    "foi_entregue" BOOLEAN NOT NULL DEFAULT false,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "perfil_id" TEXT NOT NULL,

    CONSTRAINT "vendas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produto_da_venda" (
    "quantidade" INTEGER NOT NULL,
    "venda_id" INTEGER NOT NULL,
    "produto_id" INTEGER NOT NULL,

    CONSTRAINT "produto_da_venda_pkey" PRIMARY KEY ("venda_id","produto_id")
);

-- CreateTable
CREATE TABLE "jogadores" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "numero_camisa" INTEGER,
    "classificacao" TEXT,
    "nacionalidade" TEXT,
    "idade" INTEGER,
    "foto" TEXT,
    "on_team" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "jogadores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "funcao" TEXT NOT NULL,
    "foto" TEXT,
    "on_team" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "premiacoes" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "jogador_id" INTEGER NOT NULL,

    CONSTRAINT "premiacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campeonatos_ganhos" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,

    CONSTRAINT "campeonatos_ganhos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "elenco_do_campeonato" (
    "id" SERIAL NOT NULL,
    "campeonato_id" INTEGER NOT NULL,
    "jogador_id" INTEGER,
    "staff_id" INTEGER,

    CONSTRAINT "elenco_do_campeonato_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jogos" (
    "id" SERIAL NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "time_adversario" TEXT NOT NULL,
    "local" TEXT NOT NULL,
    "campeonato" TEXT,

    CONSTRAINT "jogos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "perfis_email_key" ON "perfis"("email");

-- CreateIndex
CREATE UNIQUE INDEX "enderecos_perfil_id_key" ON "enderecos"("perfil_id");

-- AddForeignKey
ALTER TABLE "enderecos" ADD CONSTRAINT "enderecos_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "perfis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendas" ADD CONSTRAINT "vendas_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "perfis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produto_da_venda" ADD CONSTRAINT "produto_da_venda_venda_id_fkey" FOREIGN KEY ("venda_id") REFERENCES "vendas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produto_da_venda" ADD CONSTRAINT "produto_da_venda_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "produtos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "premiacoes" ADD CONSTRAINT "premiacoes_jogador_id_fkey" FOREIGN KEY ("jogador_id") REFERENCES "jogadores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "elenco_do_campeonato" ADD CONSTRAINT "elenco_do_campeonato_campeonato_id_fkey" FOREIGN KEY ("campeonato_id") REFERENCES "campeonatos_ganhos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "elenco_do_campeonato" ADD CONSTRAINT "elenco_do_campeonato_jogador_id_fkey" FOREIGN KEY ("jogador_id") REFERENCES "jogadores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "elenco_do_campeonato" ADD CONSTRAINT "elenco_do_campeonato_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;
