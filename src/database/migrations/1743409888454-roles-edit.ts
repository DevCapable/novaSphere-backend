import { MigrationInterface, QueryRunner } from 'typeorm';

export class RolesEdit1743409888454 implements MigrationInterface {
  name = 'RolesEdit1743409888454';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "PERMISSIONS" ADD "ORIGIN" varchar2(255) DEFAULT 'NOGIC' NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "ROLES" ADD "SPECIAL" number DEFAULT 0 NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "ROLES" ADD "ORIGIN" varchar2(255) DEFAULT 'NOGIC' NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ROLES" DROP COLUMN "ORIGIN"`);
    await queryRunner.query(`ALTER TABLE "ROLES" DROP COLUMN "SPECIAL"`);
    await queryRunner.query(`ALTER TABLE "PERMISSIONS" DROP COLUMN "ORIGIN"`);
  }
}
