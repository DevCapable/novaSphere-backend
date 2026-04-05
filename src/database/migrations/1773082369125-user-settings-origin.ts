/* eslint-disable prettier/prettier */
import { MigrationInterface, QueryRunner } from "typeorm";

export class UserSettingsOrigin1773082369125 implements MigrationInterface {
    name = 'UserSettingsOrigin1773082369125'

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE "USER_SETTINGS" ADD "ORIGIN" varchar2(255) DEFAULT 'NOGIC' NOT NULL`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
       
        await queryRunner.query(`ALTER TABLE "USER_SETTINGS" DROP COLUMN "ORIGIN"`);
       
    }

}
