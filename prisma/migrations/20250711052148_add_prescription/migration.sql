-- CreateTable
CREATE TABLE `Prescription` (
    `prescription_id` INTEGER NOT NULL AUTO_INCREMENT,
    `patient_id` INTEGER NOT NULL,
    `doctor_id` INTEGER NOT NULL,
    `total_cost` INTEGER NOT NULL,
    `prescribed_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`prescription_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PrescriptionItem` (
    `item_id` INTEGER NOT NULL AUTO_INCREMENT,
    `prescription_id` INTEGER NOT NULL,
    `medicine_id` INTEGER NOT NULL,
    `dose_morning` VARCHAR(191) NOT NULL,
    `dose_mid_day` VARCHAR(191) NOT NULL,
    `dose_night` VARCHAR(191) NOT NULL,
    `discount_type` ENUM('None', 'Flat', 'Percentage') NULL,
    `discount_value` DOUBLE NULL,
    `treatment_name` VARCHAR(191) NULL,
    `duration_days` INTEGER NOT NULL,
    `advice` VARCHAR(191) NULL,

    PRIMARY KEY (`item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Prescription` ADD CONSTRAINT `Prescription_patient_id_fkey` FOREIGN KEY (`patient_id`) REFERENCES `Patient`(`patient_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Prescription` ADD CONSTRAINT `Prescription_doctor_id_fkey` FOREIGN KEY (`doctor_id`) REFERENCES `Doctor`(`doctor_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PrescriptionItem` ADD CONSTRAINT `PrescriptionItem_prescription_id_fkey` FOREIGN KEY (`prescription_id`) REFERENCES `Prescription`(`prescription_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PrescriptionItem` ADD CONSTRAINT `PrescriptionItem_medicine_id_fkey` FOREIGN KEY (`medicine_id`) REFERENCES `Medicine`(`medicine_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
