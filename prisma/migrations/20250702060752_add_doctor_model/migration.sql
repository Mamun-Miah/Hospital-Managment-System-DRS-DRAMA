-- CreateTable
CREATE TABLE `Doctor` (
    `doctor_id` INTEGER NOT NULL AUTO_INCREMENT,
    `doctor_image` VARCHAR(255) NULL,
    `doctor_name` VARCHAR(100) NOT NULL,
    `specialization` VARCHAR(100) NULL,
    `email` VARCHAR(100) NULL,
    `phone_number` VARCHAR(15) NULL,
    `address_line1` VARCHAR(255) NULL,
    `city` VARCHAR(100) NULL,
    `state_province` VARCHAR(100) NULL,
    `postal_code` VARCHAR(20) NULL,
    `status` ENUM('Active', 'Suspended', 'Retired') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`doctor_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
