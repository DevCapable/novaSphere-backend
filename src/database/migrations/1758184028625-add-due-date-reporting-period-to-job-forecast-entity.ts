import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDueDateReportingPeriodToJobForecastEntity1758184028625 implements MigrationInterface {
  name = 'AddDueDateReportingPeriodToJobForecastEntity1758184028625';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "JOB_FORECAST_APPLICATIONS" ADD "DUE_DATE" varchar2(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "JOB_FORECAST_APPLICATIONS" ADD "REPORTING_PERIOD" varchar2(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "JOB_FORECAST_APPLICATIONS" DROP COLUMN "REPORTING_PERIOD"`,
    );
    await queryRunner.query(
      `ALTER TABLE "JOB_FORECAST_APPLICATIONS" DROP COLUMN "DUE_DATE"`,
    );
  }
}
