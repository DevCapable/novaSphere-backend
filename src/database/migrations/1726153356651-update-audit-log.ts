/* eslint-disable prettier/prettier */
import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAuditLog1726153356651 implements MigrationInterface {
    name = 'UpdateAuditLog1726153356651'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "AUDIT_LOGS" DROP COLUMN "ATTRIBUTES"`);
        await queryRunner.query(`ALTER TABLE "AUDIT_LOGS" DROP COLUMN "ENCRYPTED_DATA"`);
        await queryRunner.query(`ALTER TABLE "AUDIT_LOGS" DROP COLUMN "ACCOUNT_ID"`);
        await queryRunner.query(`ALTER TABLE "AUDIT_LOGS" DROP COLUMN "USER_AGENT"`);
        await queryRunner.query(`ALTER TABLE "AUDIT_LOGS" DROP COLUMN "NEW_VALUE"`);
        await queryRunner.query(`ALTER TABLE "AUDIT_LOGS" DROP COLUMN "OLD_VALUE"`);
        await queryRunner.query(`ALTER TABLE "AUDIT_LOGS" ADD "USER_ID" number NOT NULL`);
        await queryRunner.query(`ALTER TABLE "AUDIT_LOGS" ADD "CHANGES" clob`);
        await queryRunner.query(`ALTER TABLE "AUDIT_LOGS" MODIFY "IV" varchar2(255)  NULL`);
        await queryRunner.query(`ALTER TABLE "AUDIT_LOGS" ADD CONSTRAINT "FK_d7cf2455cb06dbf905ef49c6566" FOREIGN KEY ("USER_ID") REFERENCES "USERS" ("ID")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "AUDIT_LOGS" DROP CONSTRAINT "FK_d7cf2455cb06dbf905ef49c6566"`);
        await queryRunner.query(`ALTER TABLE "AUDIT_LOGS" MODIFY "IV" varchar2(255)  NOT NULL`);
        await queryRunner.query(`ALTER TABLE "AUDIT_LOGS" DROP COLUMN "CHANGES"`);
        await queryRunner.query(`ALTER TABLE "AUDIT_LOGS" DROP COLUMN "USER_ID"`);
        await queryRunner.query(`ALTER TABLE "AUDIT_LOGS" ADD "OLD_VALUE" clob`);
        await queryRunner.query(`ALTER TABLE "AUDIT_LOGS" ADD "NEW_VALUE" clob`);
        await queryRunner.query(`ALTER TABLE "AUDIT_LOGS" ADD "USER_AGENT" varchar2(255)`);
        await queryRunner.query(`ALTER TABLE "AUDIT_LOGS" ADD "ACCOUNT_ID" number NOT NULL`);
        await queryRunner.query(`ALTER TABLE "AUDIT_LOGS" ADD "ENCRYPTED_DATA" clob`);
        await queryRunner.query(`ALTER TABLE "AUDIT_LOGS" ADD "ATTRIBUTES" clob NOT NULL`);
    }

}
