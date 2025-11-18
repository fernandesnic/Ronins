/*
  Warnings:

  - You are about to drop the `Apoiadores` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Apoiadores";

-- CreateTable
CREATE TABLE "apoiadores" (
    "id" SERIAL NOT NULL,
    "apoiador" TEXT NOT NULL,
    "meses" INTEGER NOT NULL,

    CONSTRAINT "apoiadores_pkey" PRIMARY KEY ("id")
);
