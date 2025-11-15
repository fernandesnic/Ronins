-- CreateTable
CREATE TABLE "Apoiadores" (
    "id" SERIAL NOT NULL,
    "apoiador" TEXT NOT NULL,
    "meses" INTEGER NOT NULL,

    CONSTRAINT "Apoiadores_pkey" PRIMARY KEY ("id")
);
