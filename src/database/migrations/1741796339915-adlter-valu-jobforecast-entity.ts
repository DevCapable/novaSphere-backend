import { MigrationInterface, QueryRunner } from 'typeorm';

export class AdlterValuJobforecastEntity1741796339915 implements MigrationInterface {
  name = 'AdlterValuJobforecastEntity1741796339915';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "JOB_FORECAST_REQUESTS" DROP COLUMN "ESTIMATED_COST"`,
    );
    await queryRunner.query(`ALTER TABLE "JOB_FORECAST_REQUESTS"
        ADD "ESTIMATED_COST" varchar2(255) NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "JOB_FORECAST_MATERIAL_REQUESTS" DROP COLUMN "VALUE"`,
    );
    await queryRunner.query(`ALTER TABLE "JOB_FORECAST_MATERIAL_REQUESTS"
        ADD "VALUE" varchar2(255) NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "JOB_FORECAST_MATERIAL_REQUESTS" DROP COLUMN "VALUE"`,
    );
    await queryRunner.query(`ALTER TABLE "JOB_FORECAST_MATERIAL_REQUESTS"
        ADD "VALUE" number NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "JOB_FORECAST_REQUESTS" DROP COLUMN "ESTIMATED_COST"`,
    );
    await queryRunner.query(`ALTER TABLE "JOB_FORECAST_REQUESTS"
        ADD "ESTIMATED_COST" number NOT NULL`);
  }
}
