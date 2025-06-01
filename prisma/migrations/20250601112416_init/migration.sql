-- CreateEnum
CREATE TYPE "Room" AS ENUM ('salon', 'cuisine', 'entree', 'toilettes', 'salle_de_bain', 'chambre_principale', 'chambre_secondaire');

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "room" "Room" NOT NULL,
    "frequency_type" TEXT NOT NULL,
    "frequency_value" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_executed_at" TIMESTAMP(3),
    "next_execution" TIMESTAMP(3) NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "user_id" TEXT NOT NULL,
    "execution_history" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Task_user_id_idx" ON "Task"("user_id");

-- CreateIndex
CREATE INDEX "Task_next_execution_idx" ON "Task"("next_execution");
