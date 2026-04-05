import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModSkillTable1723727962701 implements MigrationInterface {
  name = 'ModSkillTable1723727962701';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "SKILLS" DROP COLUMN "DESCRIPTION"`);
    await queryRunner.query(
      `ALTER TABLE "SKILLS" ADD "DESCRIPTION" varchar2(1000)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "SKILLS" DROP COLUMN "DESCRIPTION"`);
    await queryRunner.query(
      `ALTER TABLE "SKILLS" ADD "DESCRIPTION" varchar2(255)`,
    );
  }
}
