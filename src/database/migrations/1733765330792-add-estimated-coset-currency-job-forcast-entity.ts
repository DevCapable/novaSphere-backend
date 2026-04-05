import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEstimatedCosetCurrencyJobForcastEntity1733765330792 implements MigrationInterface {
  name = 'AddEstimatedCosetCurrencyJobForcastEntity1733765330792';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "JOB_FORECAST_REQUESTS"
        ADD "ESTIMATED_COST_CURRENCY" varchar2(255)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "JOB_FORECAST_REQUESTS" DROP COLUMN "ESTIMATED_COST_CURRENCY"`,
    );
  }
}
