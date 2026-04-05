/* eslint-disable prettier/prettier */
import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTitleToAudit1726688035000 implements MigrationInterface {
    name = 'AddTitleToAudit1726688035000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "AUDIT_LOGS" ADD "ENTITY_TITLE" varchar2(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "AUDIT_LOGS" DROP COLUMN "ENTITY_TITLE"`);
    }

}
