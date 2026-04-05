import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAdditionalFieldsJobForecastMaterialEntity1742306192005 implements MigrationInterface {
  name = 'AddAdditionalFieldsJobForecastMaterialEntity1742306192005';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "JOB_FORECAST_MATERIAL_REQUESTS"
        ADD "EXISTING" number`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "JOB_FORECAST_MATERIAL_REQUESTS" DROP COLUMN "EXISTING"`,
    );
  }
}
