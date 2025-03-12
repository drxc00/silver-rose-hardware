-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_parentCategory_fkey";

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parentCategory_fkey" FOREIGN KEY ("parentCategory") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
