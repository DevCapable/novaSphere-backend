import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAdditionalFieldsJobForecastEntity1742298565768 implements MigrationInterface {
  name = 'AddAdditionalFieldsJobForecastEntity1742298565768';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "JOB_FORECAST_REQUESTS" RENAME COLUMN "ESTIMATED_COST_CURRENCY" TO "EXISTING"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "JOB_FORECAST_REQUESTS" RENAME COLUMN "EXISTING" TO "ESTIMATED_COST_CURRENCY"`,
    );
  }
}
