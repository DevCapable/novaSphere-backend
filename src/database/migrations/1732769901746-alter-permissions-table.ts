import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterPermissionsTable1732769901746 implements MigrationInterface {
  name = 'AlterPermissionsTable1732769901746';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "USER_PERMISSIONS" ("USER_ID" number NOT NULL, "PERMISSION_ID" number NOT NULL, CONSTRAINT "PK_32e1e13d95098bef117c0e08237" PRIMARY KEY ("USER_ID", "PERMISSION_ID"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b14b7a65f83dd2b9ca2d6542d8" ON "USER_PERMISSIONS" ("USER_ID")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d88c362861da4c054b7b3f06d1" ON "USER_PERMISSIONS" ("PERMISSION_ID")`,
    );
    await queryRunner.query(
      `ALTER TABLE "PERMISSIONS" ADD "IS_SPECIAL" number DEFAULT 0 NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "USER_PERMISSIONS" ADD CONSTRAINT "FK_b14b7a65f83dd2b9ca2d6542d84" FOREIGN KEY ("USER_ID") REFERENCES "USERS" ("ID") ON DELETE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "USER_PERMISSIONS" ADD CONSTRAINT "FK_d88c362861da4c054b7b3f06d1c" FOREIGN KEY ("PERMISSION_ID") REFERENCES "PERMISSIONS" ("ID")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "USER_PERMISSIONS" DROP CONSTRAINT "FK_d88c362861da4c054b7b3f06d1c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "USER_PERMISSIONS" DROP CONSTRAINT "FK_b14b7a65f83dd2b9ca2d6542d84"`,
    );
    await queryRunner.query(
      `ALTER TABLE "PERMISSIONS" DROP COLUMN "IS_SPECIAL"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_d88c362861da4c054b7b3f06d1"`);
    await queryRunner.query(`DROP INDEX "IDX_b14b7a65f83dd2b9ca2d6542d8"`);
    await queryRunner.query(`DROP TABLE "USER_PERMISSIONS"`);
  }
}
