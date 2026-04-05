import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterValueJobForecastEntity1771859428464 implements MigrationInterface {
  name = 'AlterValueJobForecastEntity1771859428464';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "JOB_FORECAST_MATERIAL_REQUESTS" DROP COLUMN "VALUE"`,
    );
    await queryRunner.query(
      `ALTER TABLE "JOB_FORECAST_MATERIAL_REQUESTS" ADD "VALUE" number(20,2)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "JOB_FORECAST_MATERIAL_REQUESTS" DROP COLUMN "VALUE"`,
    );
    await queryRunner.query(
      `ALTER TABLE "JOB_FORECAST_MATERIAL_REQUESTS" ADD "VALUE" varchar2(255) NOT NULL`,
    );
  }
}
