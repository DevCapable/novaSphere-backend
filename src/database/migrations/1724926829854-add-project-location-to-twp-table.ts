import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProjectLocationToTwpTable1724926829854 implements MigrationInterface {
  name = 'AddProjectLocationToTwpTable1724926829854';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "TWP_APPLICATIONS" ADD "PROJECT_LOCATION" varchar2(3000) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "TWP_REQUESTS" MODIFY "PROJECT_LOCATION" varchar2(3000)  NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "TWP_REQUESTS" MODIFY "PROJECT_LOCATION" varchar2(255)  NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "TWP_APPLICATIONS" DROP COLUMN "PROJECT_LOCATION"`,
    );
  }
}
