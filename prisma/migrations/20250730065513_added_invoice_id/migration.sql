/*
  Warnings:

  - You are about to drop the column `invoice_id` on the `prescription` table. All the data in the column will be lost.

*/
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
ALTER TABLE `prescription` DROP COLUMN `invoice_id`;

-- CreateTable
CREATE TABLE `Invoice` (
    `invoice_id` INTEGER NOT NULL AUTO_INCREMENT,
    `invoice_number` VARCHAR(191) NOT NULL,
    `patient_id` INTEGER NOT NULL,
    `doctor_id` INTEGER NULL,
    `prescription_id` INTEGER NOT NULL,
    `payment_method` ENUM('Partial', 'Full', 'Due') NOT NULL,
    `payment_type` ENUM('Bkash', 'Cash') NOT NULL,
    `previous_due` INTEGER NULL DEFAULT 0,
    `invoice_creation_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `total_treatment_cost` INTEGER NULL,
    `paid_amount` INTEGER NULL,
    `doctor_fee` INTEGER NULL,
    `due_amount` INTEGER NULL,
    `next_session_date` DATETIME(3) NULL,
    `previous_session_date` DATETIME(3) NULL,

    UNIQUE INDEX `Invoice_invoice_number_key`(`invoice_number`),
    PRIMARY KEY (`invoice_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
