/*
  Warnings:

  - You are about to drop the column `perfil_id` on the `enderecos` table. All the data in the column will be lost.
  - You are about to drop the column `perfil_id` on the `vendas` table. All the data in the column will be lost.
  - You are about to drop the `perfis` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `enderecos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `vendas` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "enderecos" DROP CONSTRAINT "enderecos_perfil_id_fkey";

-- DropForeignKey
ALTER TABLE "vendas" DROP CONSTRAINT "vendas_perfil_id_fkey";

-- DropIndex
DROP INDEX "enderecos_perfil_id_key";

-- AlterTable
ALTER TABLE "enderecos" DROP COLUMN "perfil_id",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "vendas" DROP COLUMN "perfil_id",
ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "perfis";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "is_socio" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "enderecos" ADD CONSTRAINT "enderecos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendas" ADD CONSTRAINT "vendas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
