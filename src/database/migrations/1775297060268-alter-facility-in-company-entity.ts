import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterFacilityInCompanyEntity1775297060268 implements MigrationInterface {
  name = 'AlterFacilityInCompanyEntity1775297060268';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ACCOUNT_COMPANIES" ADD "NEW_FACILITY_ID" number`,
    );
    await queryRunner.query(
      `ALTER TABLE "ACCOUNT_COMPANIES" ADD CONSTRAINT "FK_8ec10ad5a290af62a9b53dd71a0" FOREIGN KEY ("NEW_FACILITY_ID") REFERENCES "BASE_RECORDS" ("ID")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ACCOUNT_COMPANIES" DROP CONSTRAINT "FK_8ec10ad5a290af62a9b53dd71a0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ACCOUNT_COMPANIES" DROP COLUMN "NEW_FACILITY_ID"`,
    );
  }
}
