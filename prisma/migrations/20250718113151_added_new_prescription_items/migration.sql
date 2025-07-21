-- AlterTable
ALTER TABLE `prescriptionitem` ADD COLUMN `doctor_discount_type` ENUM('None', 'Flat', 'Percentage') NULL,
    ADD COLUMN `doctor_discount_value` DOUBLE NULL,
    ADD COLUMN `is_prescribed` VARCHAR(191) NOT NULL DEFAULT 'No',
    ADD COLUMN `next_visit_date` DATE NULL,
    ADD COLUMN `payable_doctor_amount` DOUBLE NULL,
    ADD COLUMN `payable_treatment_amount` DOUBLE NULL,
    ADD COLUMN `prescribed_doctor_name` VARCHAR(191) NOT NULL DEFAULT 'N/A',
    MODIFY `dose_morning` VARCHAR(191) NULL,
    MODIFY `dose_mid_day` VARCHAR(191) NULL,
    MODIFY `dose_night` VARCHAR(191) NULL,
    MODIFY `duration_days` INTEGER NULL;
