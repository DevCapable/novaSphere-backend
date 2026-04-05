/* eslint-disable prettier/prettier */
import { MigrationInterface, QueryRunner } from "typeorm";

export class AccountOrigin1742662582887 implements MigrationInterface {
    name = 'AccountOrigin1742662582887'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ACCOUNTS" RENAME COLUMN "EXTERNAL_APP" TO "ORIGIN"`);
        
        await queryRunner.query(`ALTER TABLE "ACCOUNTS" DROP COLUMN "ORIGIN"`);
        await queryRunner.query(`ALTER TABLE "ACCOUNTS" ADD "ORIGIN" varchar2(255) DEFAULT 'NOGIC' NOT NULL`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE "ACCOUNTS" DROP COLUMN "ORIGIN"`);
        await queryRunner.query(`ALTER TABLE "ACCOUNTS" ADD "ORIGIN" varchar2(255)`);
        
        await queryRunner.query(`ALTER TABLE "ACCOUNTS" RENAME COLUMN "ORIGIN" TO "EXTERNAL_APP"`);
    }

}
