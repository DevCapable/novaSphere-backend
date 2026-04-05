import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRelateApplicationToJobForecastMaterialReqEntity1742314604068 implements MigrationInterface {
  name = 'AddRelateApplicationToJobForecastMaterialReqEntity1742314604068';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "JOB_FORECAST_MATERIAL_REQUESTS"
        ADD "APPLICATION_ID" NUMBER`);

    await queryRunner.query(`ALTER TABLE "JOB_FORECAST_MATERIAL_REQUESTS"
        ADD CONSTRAINT "FK_7febb4ba2a5c5dd85aa7381cb0a" FOREIGN KEY ("APPLICATION_ID") REFERENCES "JOB_FORECAST_APPLICATIONS" ("ID")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "JOB_FORECAST_MATERIAL_REQUESTS" DROP CONSTRAINT "FK_7febb4ba2a5c5dd85aa7381cb0a"`,
    );

    await queryRunner.query(
      `ALTER TABLE "JOB_FORECAST_MATERIAL_REQUESTS" DROP COLUMN "APPLICATION_ID"`,
    );
  }
}
