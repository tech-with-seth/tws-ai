-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('CREATE_THREAD', 'DELETE_THREAD', 'UPLOAD_FILE', 'DELETE_FILE', 'CREATE_ASSISTANT', 'UPDATE_ASSISTANT', 'LOGIN', 'LOGOUT');

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "action" "ActionType" NOT NULL,
    "details" JSONB,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
