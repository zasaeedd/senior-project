-- CreateTable
CREATE TABLE "Badge" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "unlock_condition" TEXT NOT NULL,

    CONSTRAINT "Badge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentBadge" (
    "earned_at" TIMESTAMP(3) NOT NULL,
    "studentID" INTEGER NOT NULL,
    "badgeID" INTEGER NOT NULL,

    CONSTRAINT "StudentBadge_pkey" PRIMARY KEY ("studentID","badgeID")
);

-- CreateTable
CREATE TABLE "PowerUp" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "effect_type" TEXT NOT NULL,
    "effect_value" TEXT NOT NULL,
    "unlock_condition" TEXT NOT NULL,

    CONSTRAINT "PowerUp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentPowerUp" (
    "quantity" INTEGER NOT NULL,
    "studentID" INTEGER NOT NULL,
    "powerupID" INTEGER NOT NULL,

    CONSTRAINT "StudentPowerUp_pkey" PRIMARY KEY ("studentID","powerupID")
);

-- CreateTable
CREATE TABLE "Streak" (
    "studentID" INTEGER NOT NULL,
    "current_streak" INTEGER NOT NULL,
    "longest_streak" INTEGER NOT NULL,
    "lad" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Streak_pkey" PRIMARY KEY ("studentID")
);

-- AddForeignKey
ALTER TABLE "StudentBadge" ADD CONSTRAINT "StudentBadge_studentID_fkey" FOREIGN KEY ("studentID") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentBadge" ADD CONSTRAINT "StudentBadge_badgeID_fkey" FOREIGN KEY ("badgeID") REFERENCES "Badge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentPowerUp" ADD CONSTRAINT "StudentPowerUp_studentID_fkey" FOREIGN KEY ("studentID") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentPowerUp" ADD CONSTRAINT "StudentPowerUp_powerupID_fkey" FOREIGN KEY ("powerupID") REFERENCES "PowerUp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Streak" ADD CONSTRAINT "Streak_studentID_fkey" FOREIGN KEY ("studentID") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
