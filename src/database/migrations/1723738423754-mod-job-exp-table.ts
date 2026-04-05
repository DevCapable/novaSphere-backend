import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModJobExpTable1723738423754 implements MigrationInterface {
  name = 'ModJobExpTable1723738423754';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "SKILLS" DROP COLUMN "DESCRIPTION"`);
    await queryRunner.query(`ALTER TABLE "SKILLS" ADD "DESCRIPTION" clob`);
    await queryRunner.query(
      `ALTER TABLE "JOB_EXPERIENCES" DROP COLUMN "DESCRIPTION"`,
    );
    await queryRunner.query(
      `ALTER TABLE "JOB_EXPERIENCES" ADD "DESCRIPTION" clob`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "JOB_EXPERIENCES" DROP COLUMN "DESCRIPTION"`,
    );
    await queryRunner.query(
      `ALTER TABLE "JOB_EXPERIENCES" ADD "DESCRIPTION" varchar2(255)`,
    );
    await queryRunner.query(`ALTER TABLE "SKILLS" DROP COLUMN "DESCRIPTION"`);
    await queryRunner.query(
      `ALTER TABLE "SKILLS" ADD "DESCRIPTION" varchar2(1000)`,
    );
  }
}
