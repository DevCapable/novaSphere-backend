/* eslint-disable prettier/prettier */
import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAccountExternal1734521359297 implements MigrationInterface {
    name = 'UpdateAccountExternal1734521359297'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ACCOUNTS" ADD "IS_ACTIVE" number DEFAULT 1 NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ACCOUNTS" ADD "EXTERNAL_APP" varchar2(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ACCOUNTS" DROP COLUMN "EXTERNAL_APP"`);
        await queryRunner.query(`ALTER TABLE "ACCOUNTS" DROP COLUMN "IS_ACTIVE"`);
    }

}
