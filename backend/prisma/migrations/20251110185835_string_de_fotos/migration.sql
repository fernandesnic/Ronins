/*
  Warnings:

  - The `foto` column on the `campeonatos_ganhos` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "campeonatos_ganhos" DROP COLUMN "foto",
ADD COLUMN     "foto" TEXT[];
