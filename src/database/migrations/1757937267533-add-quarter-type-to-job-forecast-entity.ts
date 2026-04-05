import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddQuarterTypeToJobForecastEntity1757937267533 implements MigrationInterface {
  name = 'AddQuarterTypeToJobForecastEntity1757937267533';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "JOB_FORECAST_APPLICATIONS" ADD "QUARTER" varchar2(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "JOB_FORECAST_APPLICATIONS" ADD "REPORTING_YEAR" varchar2(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "JOB_FORECAST_APPLICATIONS" ADD "REPORT_STATUS" varchar2(255) DEFAULT 'SCHEDULED' NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "JOB_FORECAST_APPLICATIONS" DROP COLUMN "REPORT_STATUS"`,
    );
    await queryRunner.query(
      `ALTER TABLE "JOB_FORECAST_APPLICATIONS" DROP COLUMN "REPORTING_YEAR"`,
    );
    await queryRunner.query(
      `ALTER TABLE "JOB_FORECAST_APPLICATIONS" DROP COLUMN "QUARTER"`,
    );
  }
}
