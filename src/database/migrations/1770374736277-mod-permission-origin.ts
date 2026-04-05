import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModPermissionOrigin1770374736277 implements MigrationInterface {
  name = 'ModPermissionOrigin1770374736277';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "PERMISSIONS" MODIFY "ORIGIN" varchar2(255) DEFAULT NULL NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "PERMISSIONS" MODIFY "ORIGIN" varchar2(255) DEFAULT 'NOGIC' NOT NULL`,
    );
  }
}
