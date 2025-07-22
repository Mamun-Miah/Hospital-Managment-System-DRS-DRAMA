-- DropForeignKey
ALTER TABLE `prescriptionitem` DROP FOREIGN KEY `PrescriptionItem_medicine_id_fkey`;

-- DropIndex
DROP INDEX `PrescriptionItem_medicine_id_fkey` ON `prescriptionitem`;

-- AlterTable
ALTER TABLE `prescriptionitem` MODIFY `medicine_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `PrescriptionItem` ADD CONSTRAINT `PrescriptionItem_medicine_id_fkey` FOREIGN KEY (`medicine_id`) REFERENCES `Medicine`(`medicine_id`) ON DELETE SET NULL ON UPDATE CASCADE;
