-- DropForeignKey
ALTER TABLE "quotation_items" DROP CONSTRAINT "quotation_items_variantId_fkey";

-- AddForeignKey
ALTER TABLE "quotation_items" ADD CONSTRAINT "quotation_items_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
