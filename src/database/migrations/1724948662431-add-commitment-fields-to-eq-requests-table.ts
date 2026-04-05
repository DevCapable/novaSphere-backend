import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCommitmentFieldsToEqRequestsTable1724948662431 implements MigrationInterface {
  name = 'AddCommitmentFieldsToEqRequestsTable1724948662431';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "EQ_REQUESTS" ADD "EMPLOYMENT_COMMITMENT_DATE" timestamp NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "EQ_REQUESTS" ADD "EMPLOYMENT_COMMITMENT_EXP_COUNT" number NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "EQ_REQUESTS" ADD "NIGERIANIZATION_COMMITMENT_DATE" timestamp NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "EQ_REQUESTS" DROP COLUMN "NIGERIANIZATION_COMMITMENT_DATE"`,
    );
    await queryRunner.query(
      `ALTER TABLE "EQ_REQUESTS" DROP COLUMN "EMPLOYMENT_COMMITMENT_EXP_COUNT"`,
    );
    await queryRunner.query(
      `ALTER TABLE "EQ_REQUESTS" DROP COLUMN "EMPLOYMENT_COMMITMENT_DATE"`,
    );
  }
}
