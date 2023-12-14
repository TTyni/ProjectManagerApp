-- CreateTable
CREATE TABLE "ProjectUsers" (
    "userid" INTEGER NOT NULL,
    "projectid" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectUsers_pkey" PRIMARY KEY ("projectid","userid")
);

-- AddForeignKey
ALTER TABLE "ProjectUsers" ADD CONSTRAINT "ProjectUsers_userid_fkey" FOREIGN KEY ("userid") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectUsers" ADD CONSTRAINT "ProjectUsers_projectid_fkey" FOREIGN KEY ("projectid") REFERENCES "Projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
