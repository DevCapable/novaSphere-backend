import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModTrainingTable1723750328766 implements MigrationInterface {
  name = 'ModTrainingTable1723750328766';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "TRAININGS" DROP COLUMN "DESCRIPTION"`,
    );
    await queryRunner.query(`ALTER TABLE "TRAININGS" ADD "DESCRIPTION" clob`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "TRAININGS" DROP COLUMN "DESCRIPTION"`,
    );
    await queryRunner.query(
      `ALTER TABLE "TRAININGS" ADD "DESCRIPTION" varchar2(255)`,
    );
  }
}
