-- CreateTable
CREATE TABLE "contato_msgs" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "lido" BOOLEAN NOT NULL DEFAULT false,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contato_msgs_pkey" PRIMARY KEY ("id")
);
