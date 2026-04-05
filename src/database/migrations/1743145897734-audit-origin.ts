/* eslint-disable prettier/prettier */
import { MigrationInterface, QueryRunner } from "typeorm";

export class AuditOrigin1743145897734 implements MigrationInterface {
    name = 'AuditOrigin1743145897734'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "AUDIT_LOGS" ADD "ORIGIN" varchar2(255) DEFAULT 'NOGIC' NOT NULL`);
       
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
       
        await queryRunner.query(`ALTER TABLE "AUDIT_LOGS" DROP COLUMN "ORIGIN"`);
       
    }

}
