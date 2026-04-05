import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModCertificateExpiryYear1724007249763 implements MigrationInterface {
  name = 'ModCertificateExpiryYear1724007249763';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Step 1: Add a new column with CLOB type
    await queryRunner.query(
      `ALTER TABLE "JOB_EXPERIENCES" ADD "ORG_ADDRESS_NEW" clob NULL`,
    );

    // Step 2: Copy data from the old column to the new column
    await queryRunner.query(
      `UPDATE "JOB_EXPERIENCES" SET "ORG_ADDRESS_NEW" = "ORG_ADDRESS"`,
    );

    // Step 3: Drop the old column
    await queryRunner.query(
      `ALTER TABLE "JOB_EXPERIENCES" DROP COLUMN "ORG_ADDRESS"`,
    );

    // Step 4: Rename the new column to the original column name
    await queryRunner.query(
      `ALTER TABLE "JOB_EXPERIENCES" RENAME COLUMN "ORG_ADDRESS_NEW" TO "ORG_ADDRESS"`,
    );

    // Modifying START_DATE and EXPIRY_YEAR columns as required
    await queryRunner.query(
      `ALTER TABLE "JOB_EXPERIENCES" MODIFY "START_DATE" timestamp NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "CERTIFICATIONS" MODIFY "EXPIRY_YEAR" number NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverse process in case of rollback

    // Step 1: Add a new column with the original type
    await queryRunner.query(
      `ALTER TABLE "JOB_EXPERIENCES" ADD "ORG_ADDRESS_NEW" varchar2(4000) NULL`,
    );

    // Step 2: Copy data back to the new column
    await queryRunner.query(
      `UPDATE "JOB_EXPERIENCES" SET "ORG_ADDRESS_NEW" = "ORG_ADDRESS"`,
    );

    // Step 3: Drop the CLOB column
    await queryRunner.query(
      `ALTER TABLE "JOB_EXPERIENCES" DROP COLUMN "ORG_ADDRESS"`,
    );

    // Step 4: Rename the new column back to the original name
    await queryRunner.query(
      `ALTER TABLE "JOB_EXPERIENCES" RENAME COLUMN "ORG_ADDRESS_NEW" TO "ORG_ADDRESS"`,
    );

    // Reverse START_DATE and EXPIRY_YEAR modifications
    await queryRunner.query(
      `ALTER TABLE "CERTIFICATIONS" MODIFY "EXPIRY_YEAR" number NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "JOB_EXPERIENCES" MODIFY "START_DATE" timestamp NOT NULL`,
    );
  }
}
