/* eslint-disable prettier/prettier */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveUuidAuditLog1730473189615 implements MigrationInterface {
  name = 'RemoveUuidAuditLog1730473189615';

  public async up(queryRunner: QueryRunner): Promise<void> {
    /*await queryRunner.query(
      `ALTER TABLE "AUDIT_LOGS" DROP CONSTRAINT "UQ_312c7c3ebc03a19c510e887d684"`,
    );
    await queryRunner.query(`ALTER TABLE "AUDIT_LOGS" DROP COLUMN "UUID"`);*/
    /* await queryRunner.query(`CREATE INDEX "IDX_d7cf2455cb06dbf905ef49c656" ON "AUDIT_LOGS" ("USER_ID")`);
        await queryRunner.query(`CREATE INDEX "IDX_17073f6e0ce0b5ca7e549bb5a0" ON "AUDIT_LOGS" ("ENTITY_ID")`);
        await queryRunner.query(`CREATE INDEX "IDX_045ce026395d5a1a99774ddd46" ON "AUDIT_LOGS" ("ENTITY_ID", "USER_ID")`);*/
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    /*await queryRunner.query(`DROP INDEX "IDX_045ce026395d5a1a99774ddd46"`);
        await queryRunner.query(`DROP INDEX "IDX_17073f6e0ce0b5ca7e549bb5a0"`);
        await queryRunner.query(`DROP INDEX "IDX_d7cf2455cb06dbf905ef49c656"`);*/

    await queryRunner.query(
      `ALTER TABLE "AUDIT_LOGS" ADD "UUID" varchar2(36) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "AUDIT_LOGS" ADD CONSTRAINT "UQ_312c7c3ebc03a19c510e887d684" UNIQUE ("UUID")`,
    );
  }
}
