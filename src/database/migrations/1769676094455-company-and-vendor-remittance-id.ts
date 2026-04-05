import { MigrationInterface, QueryRunner } from 'typeorm';

export class CompanyAndVendorRemittanceId1769676094455 implements MigrationInterface {
  name = 'CompanyAndVendorRemittanceId1769676094455';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ACCOUNT_COMPANIES" ADD "REMITTANCE_ID" varchar2(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "ACCOUNT_COMPANIES" ADD "VENDOR_REMITTANCE_ID" varchar2(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "ACCOUNT_OPERATORS" ADD "REMITTANCE_ID" varchar2(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "ACCOUNT_OPERATORS" ADD "VENDOR_REMITTANCE_ID" varchar2(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ACCOUNT_OPERATORS" DROP COLUMN "VENDOR_REMITTANCE_ID"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ACCOUNT_OPERATORS" DROP COLUMN "REMITTANCE_ID"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ACCOUNT_COMPANIES" DROP COLUMN "VENDOR_REMITTANCE_ID"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ACCOUNT_COMPANIES" DROP COLUMN "REMITTANCE_ID"`,
    );
  }
}
