-- DropIndex
DROP INDEX `DoctorAwardsAndRecognitionInfo_doctor_id_fkey` ON `doctorawardsandrecognitioninfo`;

-- DropIndex
DROP INDEX `DoctorCertificationInfo_doctor_id_fkey` ON `doctorcertificationinfo`;

-- DropIndex
DROP INDEX `DoctorEducationalInfo_doctor_id_fkey` ON `doctoreducationalinfo`;

-- DropIndex
DROP INDEX `Invoice_doctor_id_fkey` ON `invoice`;

-- DropIndex
DROP INDEX `Invoice_patient_id_fkey` ON `invoice`;

-- DropIndex
DROP INDEX `Invoice_prescription_id_fkey` ON `invoice`;

-- DropIndex
DROP INDEX `InvoiceTreatment_invoice_id_fkey` ON `invoicetreatment`;

-- DropIndex
DROP INDEX `InvoiceTreatment_treatment_id_fkey` ON `invoicetreatment`;

-- DropIndex
DROP INDEX `PatientWeightHistory_patient_id_fkey` ON `patientweighthistory`;

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
DROP INDEX `PrescriptionTreatmentItem_patient_id_fkey` ON `prescriptiontreatmentitem`;

-- DropIndex
DROP INDEX `PrescriptionTreatmentItem_prescriptionItemItem_id_fkey` ON `prescriptiontreatmentitem`;

-- DropIndex
DROP INDEX `PrescriptionTreatmentItem_prescription_id_fkey` ON `prescriptiontreatmentitem`;

-- DropIndex
DROP INDEX `PrescriptionTreatmentItem_treatment_id_fkey` ON `prescriptiontreatmentitem`;

-- AlterTable
ALTER TABLE `doctor` ADD COLUMN `date_of_birth` DATE NULL,
    MODIFY `short_bio` LONGTEXT NULL;

-- AddForeignKey
ALTER TABLE `PatientWeightHistory` ADD CONSTRAINT `PatientWeightHistory_patient_id_fkey` FOREIGN KEY (`patient_id`) REFERENCES `Patient`(`patient_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DoctorEducationalInfo` ADD CONSTRAINT `DoctorEducationalInfo_doctor_id_fkey` FOREIGN KEY (`doctor_id`) REFERENCES `Doctor`(`doctor_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DoctorAwardsAndRecognitionInfo` ADD CONSTRAINT `DoctorAwardsAndRecognitionInfo_doctor_id_fkey` FOREIGN KEY (`doctor_id`) REFERENCES `Doctor`(`doctor_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DoctorCertificationInfo` ADD CONSTRAINT `DoctorCertificationInfo_doctor_id_fkey` FOREIGN KEY (`doctor_id`) REFERENCES `Doctor`(`doctor_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE `PrescriptionTreatmentItem` ADD CONSTRAINT `PrescriptionTreatmentItem_patient_id_fkey` FOREIGN KEY (`patient_id`) REFERENCES `Patient`(`patient_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE `InvoiceTreatment` ADD CONSTRAINT `InvoiceTreatment_invoice_id_fkey` FOREIGN KEY (`invoice_id`) REFERENCES `Invoice`(`invoice_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoiceTreatment` ADD CONSTRAINT `InvoiceTreatment_treatment_id_fkey` FOREIGN KEY (`treatment_id`) REFERENCES `Treatmentlist`(`treatment_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
