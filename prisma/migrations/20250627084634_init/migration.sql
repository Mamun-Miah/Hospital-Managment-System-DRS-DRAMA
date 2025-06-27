-- CreateTable
CREATE TABLE `Patient` (
    `patient_id` INTEGER NOT NULL AUTO_INCREMENT,
    `patient_name` VARCHAR(100) NOT NULL,
    `mobile_number` VARCHAR(15) NOT NULL,
    `email` VARCHAR(100) NULL,
    `date_of_birth` DATETIME(3) NULL,
    `gender` ENUM('Male', 'Female', 'Other') NULL,
    `address_line1` VARCHAR(255) NULL,
    `city` VARCHAR(100) NULL,
    `state_province` VARCHAR(100) NULL,
    `postal_code` VARCHAR(20) NULL,
    `emergency_contact_phone` VARCHAR(15) NULL,
    `status` ENUM('Active', 'Suspended', 'Deactivated') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `Patient_mobile_number_key`(`mobile_number`),
    PRIMARY KEY (`patient_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
