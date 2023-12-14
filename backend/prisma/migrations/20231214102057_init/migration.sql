-- DropForeignKey
ALTER TABLE "ProjectUsers" DROP CONSTRAINT "ProjectUsers_userid_fkey";

-- AddForeignKey
ALTER TABLE "ProjectUsers" ADD CONSTRAINT "ProjectUsers_userid_fkey" FOREIGN KEY ("userid") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
