-- AlterTable
ALTER TABLE `loanrequest` MODIFY `addressLine` VARCHAR(191) NULL,
    MODIFY `city` VARCHAR(191) NULL,
    MODIFY `dueDate` DATETIME(3) NULL,
    MODIFY `libraryId` INTEGER NULL,
    MODIFY `phoneNumber` VARCHAR(191) NULL,
    MODIFY `postalCode` VARCHAR(191) NULL,
    MODIFY `province` VARCHAR(191) NULL,
    MODIFY `recipientName` VARCHAR(191) NULL;
