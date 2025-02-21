/*
  Warnings:

  - Added the required column `priceAtQuotation` to the `quotation_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "quotation_items" ADD COLUMN     "priceAtQuotation" DECIMAL(65,30) NOT NULL;
