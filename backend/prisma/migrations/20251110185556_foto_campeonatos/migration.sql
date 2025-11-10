/*
  Warnings:

  - Added the required column `foto` to the `campeonatos_ganhos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "campeonatos_ganhos" ADD COLUMN     "foto" TEXT NOT NULL;
