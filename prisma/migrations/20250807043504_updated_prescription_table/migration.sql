/*
  Warnings:

  - A unique constraint covering the columns `[prescription_number]` on the table `Prescription` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `prescription_number` to the `Prescription` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Invoice_doctor_id_fkey` ON `invoice`;

-- DropIndex
DROP INDEX `Invoice_patient_id_fkey` ON `invoice`;

-- DropIndex
DROP INDEX `Invoice_prescription_id_fkey` ON `invoice`;

-- DropIndex
DROP INDEX `Prescription_doctor_id_fkey` ON `prescription`;

-- DropIndex
DROP INDEX `Prescription_patient_id_fkey` ON `prescription`;

-- DropIndex
DROP INDEX `PrescriptionItem_medicine_id_fkey` ON `prescriptionitem`;

-- DropIndex
DROP INDEX `PrescriptionItem_prescription_id_fkey` ON `prescriptionitem`;

-- DropIndex
DROP INDEX `PrescriptionItem_treatmentlistTreatment_id_fkey` ON `prescriptionitem`;

-- DropIndex
DROP INDEX `PrescriptionTreatmentItem_prescriptionItemItem_id_fkey` ON `prescriptiontreatmentitem`;

-- DropIndex
DROP INDEX `PrescriptionTreatmentItem_prescription_id_fkey` ON `prescriptiontreatmentitem`;

-- DropIndex
DROP INDEX `PrescriptionTreatmentItem_treatment_id_fkey` ON `prescriptiontreatmentitem`;

-- AlterTable
ALTER TABLE `prescription` ADD COLUMN `prescription_number` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Prescription_prescription_number_key` ON `Prescription`(`prescription_number`);

-- AddForeignKey
ALTER TABLE `Prescription` ADD CONSTRAINT `Prescription_patient_id_fkey` FOREIGN KEY (`patient_id`) REFERENCES `Patient`(`patient_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Prescription` ADD CONSTRAINT `Prescription_doctor_id_fkey` FOREIGN KEY (`doctor_id`) REFERENCES `Doctor`(`doctor_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PrescriptionItem` ADD CONSTRAINT `PrescriptionItem_prescription_id_fkey` FOREIGN KEY (`prescription_id`) REFERENCES `Prescription`(`prescription_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PrescriptionItem` ADD CONSTRAINT `PrescriptionItem_medicine_id_fkey` FOREIGN KEY (`medicine_id`) REFERENCES `Medicine`(`medicine_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PrescriptionItem` ADD CONSTRAINT `PrescriptionItem_treatmentlistTreatment_id_fkey` FOREIGN KEY (`treatmentlistTreatment_id`) REFERENCES `Treatmentlist`(`treatment_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PrescriptionTreatmentItem` ADD CONSTRAINT `PrescriptionTreatmentItem_prescription_id_fkey` FOREIGN KEY (`prescription_id`) REFERENCES `Prescription`(`prescription_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PrescriptionTreatmentItem` ADD CONSTRAINT `PrescriptionTreatmentItem_treatment_id_fkey` FOREIGN KEY (`treatment_id`) REFERENCES `Treatmentlist`(`treatment_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PrescriptionTreatmentItem` ADD CONSTRAINT `PrescriptionTreatmentItem_prescriptionItemItem_id_fkey` FOREIGN KEY (`prescriptionItemItem_id`) REFERENCES `PrescriptionItem`(`item_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_patient_id_fkey` FOREIGN KEY (`patient_id`) REFERENCES `Patient`(`patient_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_doctor_id_fkey` FOREIGN KEY (`doctor_id`) REFERENCES `Doctor`(`doctor_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_prescription_id_fkey` FOREIGN KEY (`prescription_id`) REFERENCES `Prescription`(`prescription_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
