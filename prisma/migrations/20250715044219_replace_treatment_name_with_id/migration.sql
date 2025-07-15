/*
  Warnings:

  - You are about to drop the column `treatment_name` on the `prescriptionitem` table. All the data in the column will be lost.
  - You are about to drop the `treatment` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `treatment_id` to the `PrescriptionItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `treatment` DROP FOREIGN KEY `Treatment_patient_id_fkey`;

-- AlterTable
ALTER TABLE `prescriptionitem` DROP COLUMN `treatment_name`,
    ADD COLUMN `treatment_id` INTEGER NOT NULL;

-- DropTable
DROP TABLE `treatment`;

-- AddForeignKey
ALTER TABLE `PrescriptionItem` ADD CONSTRAINT `PrescriptionItem_treatment_id_fkey` FOREIGN KEY (`treatment_id`) REFERENCES `Treatmentlist`(`treatment_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
