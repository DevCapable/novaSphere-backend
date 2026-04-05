import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterRemarksInRequestJobForecastEntity1758544073941 implements MigrationInterface {
  name = 'AlterRemarksInRequestJobForecastEntity1758544073941';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "JOB_FORECAST_REQUESTS" DROP COLUMN "REMARKS"`,
    );
    await queryRunner.query(
      `ALTER TABLE "JOB_FORECAST_REQUESTS" ADD "REMARKS" clob`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "JOB_FORECAST_REQUESTS" DROP COLUMN "REMARKS"`,
    );
    await queryRunner.query(
      `ALTER TABLE "JOB_FORECAST_REQUESTS" ADD "REMARKS" varchar2(255) NOT NULL`,
    );
  }
}
