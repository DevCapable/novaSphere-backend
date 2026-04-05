/* eslint-disable prettier/prettier */
import { MigrationInterface, QueryRunner } from "typeorm";

export class ComapnyBio1750149817453 implements MigrationInterface {
    name = 'ComapnyBio1750149817453'

    public async up(queryRunner: QueryRunner): Promise<void> {
       
        await queryRunner.query(`ALTER TABLE "ACCOUNT_COMPANIES" ADD "BIO" varchar2(3000)`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE "ACCOUNT_COMPANIES" DROP COLUMN "BIO"`);
        
    }

}
