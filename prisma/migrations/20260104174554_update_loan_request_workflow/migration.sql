/*
  Warnings:

  - Added the required column `addressLine` to the `Loan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Loan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `Loan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postalCode` to the `Loan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `province` to the `Loan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipientName` to the `Loan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Loan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addressLine` to the `LoanRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `LoanRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dueDate` to the `LoanRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `libraryId` to the `LoanRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `LoanRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postalCode` to the `LoanRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `province` to the `LoanRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipientName` to the `LoanRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `loan` ADD COLUMN `addressLine` VARCHAR(191) NOT NULL,
    ADD COLUMN `city` VARCHAR(191) NOT NULL,
    ADD COLUMN `phoneNumber` VARCHAR(191) NOT NULL,
    ADD COLUMN `postalCode` VARCHAR(191) NOT NULL,
    ADD COLUMN `province` VARCHAR(191) NOT NULL,
    ADD COLUMN `recipientName` VARCHAR(191) NOT NULL,
    ADD COLUMN `status` ENUM('PROCESSING', 'IN_DELIVERY', 'BORROWED', 'RETURNED') NOT NULL;

-- AlterTable
ALTER TABLE `loanrequest` ADD COLUMN `addressLine` VARCHAR(191) NOT NULL,
    ADD COLUMN `city` VARCHAR(191) NOT NULL,
    ADD COLUMN `dueDate` DATETIME(3) NOT NULL,
    ADD COLUMN `libraryId` INTEGER NOT NULL,
    ADD COLUMN `phoneNumber` VARCHAR(191) NOT NULL,
    ADD COLUMN `postalCode` VARCHAR(191) NOT NULL,
    ADD COLUMN `province` VARCHAR(191) NOT NULL,
    ADD COLUMN `recipientName` VARCHAR(191) NOT NULL,
    ADD COLUMN `status` ENUM('DRAFT', 'PENDING', 'REJECTED') NOT NULL DEFAULT 'DRAFT';
