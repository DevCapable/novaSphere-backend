/* eslint-disable prettier/prettier */
import { MigrationInterface, QueryRunner } from "typeorm";

export class AccountActive1742715564773 implements MigrationInterface {
    name = 'AccountActive1742715564773'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ACCOUNTS" RENAME COLUMN "IS_ACTIVE" TO "ACTIVE"`);
       
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE "ACCOUNTS" RENAME COLUMN "ACTIVE" TO "IS_ACTIVE"`);
    }

}
