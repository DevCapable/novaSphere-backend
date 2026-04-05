/* eslint-disable prettier/prettier */
import { MigrationInterface, QueryRunner } from "typeorm";

export class DocumentDomain1739199736915 implements MigrationInterface {
    name = 'DocumentDomain1739199736915'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "DOCUMENTS" ADD "DOMAIN" varchar2(255) DEFAULT 'NOGIC' NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> { 
        await queryRunner.query(`ALTER TABLE "DOCUMENTS" DROP COLUMN "DOMAIN"`);
    }

}
