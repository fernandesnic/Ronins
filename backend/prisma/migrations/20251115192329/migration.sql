/*
  Warnings:

  - The primary key for the `produto_da_venda` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `produto_id` on the `produto_da_venda` table. All the data in the column will be lost.
  - You are about to drop the column `preco` on the `produtos` table. All the data in the column will be lost.
  - You are about to drop the column `tamanho` on the `produtos` table. All the data in the column will be lost.
  - Added the required column `produto_variacao_id` to the `produto_da_venda` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "produto_da_venda" DROP CONSTRAINT "produto_da_venda_produto_id_fkey";

-- AlterTable
ALTER TABLE "produto_da_venda" DROP CONSTRAINT "produto_da_venda_pkey",
DROP COLUMN "produto_id",
ADD COLUMN     "produto_variacao_id" INTEGER NOT NULL,
ADD CONSTRAINT "produto_da_venda_pkey" PRIMARY KEY ("venda_id", "produto_variacao_id");

-- AlterTable
ALTER TABLE "produtos" DROP COLUMN "preco",
DROP COLUMN "tamanho",
ADD COLUMN     "foto_principal" TEXT;

-- CreateTable
CREATE TABLE "produto_variacoes" (
    "id" SERIAL NOT NULL,
    "tamanho" TEXT,
    "cor" TEXT,
    "preco" DOUBLE PRECISION NOT NULL,
    "estoque" INTEGER NOT NULL DEFAULT 0,
    "foto" TEXT,
    "produtoId" INTEGER NOT NULL,

    CONSTRAINT "produto_variacoes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "produto_variacoes" ADD CONSTRAINT "produto_variacoes_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produto_da_venda" ADD CONSTRAINT "produto_da_venda_produto_variacao_id_fkey" FOREIGN KEY ("produto_variacao_id") REFERENCES "produto_variacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
