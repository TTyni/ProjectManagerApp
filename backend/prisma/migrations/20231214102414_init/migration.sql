-- DropForeignKey
ALTER TABLE "ProjectUsers" DROP CONSTRAINT "ProjectUsers_projectid_fkey";

-- AddForeignKey
ALTER TABLE "ProjectUsers" ADD CONSTRAINT "ProjectUsers_projectid_fkey" FOREIGN KEY ("projectid") REFERENCES "Projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
