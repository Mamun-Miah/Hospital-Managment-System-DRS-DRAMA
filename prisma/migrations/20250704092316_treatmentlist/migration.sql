-- CreateTable
CREATE TABLE `Treatmentlist` (
    `treatment_id` INTEGER NOT NULL AUTO_INCREMENT,
    `treatment_name` VARCHAR(100) NOT NULL,
    `total_cost` DECIMAL(10, 2) NOT NULL,
    `duration_months` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`treatment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
