-- CreateTable
CREATE TABLE `Treatment` (
    `treatment_id` INTEGER NOT NULL AUTO_INCREMENT,
    `patient_id` INTEGER NOT NULL,
    `treatment_name` VARCHAR(100) NOT NULL,
    `total_cost` DECIMAL(10, 2) NOT NULL,
    `duration_months` INTEGER NOT NULL,
    `start_date` DATE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`treatment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Treatment` ADD CONSTRAINT `Treatment_patient_id_fkey` FOREIGN KEY (`patient_id`) REFERENCES `Patient`(`patient_id`) ON DELETE CASCADE ON UPDATE CASCADE;
