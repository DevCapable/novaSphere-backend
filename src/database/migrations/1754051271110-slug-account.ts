/* eslint-disable prettier/prettier */
import { MigrationInterface, QueryRunner } from "typeorm";

export class SlugAccount1754051271110 implements MigrationInterface {
    name = 'SlugAccount1754051271110'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ACCOUNTS" ADD "SLUG" varchar2(250)`);
        await queryRunner.query(`ALTER TABLE "ACCOUNTS" ADD CONSTRAINT "UQ_af8ac6d7fb2557d3cd531ee76ca" UNIQUE ("SLUG")`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE "ACCOUNTS" DROP CONSTRAINT "UQ_af8ac6d7fb2557d3cd531ee76ca"`);
        await queryRunner.query(`ALTER TABLE "ACCOUNTS" DROP COLUMN "SLUG"`);
       
    }

}
