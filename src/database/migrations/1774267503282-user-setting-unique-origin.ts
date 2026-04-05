/* eslint-disable prettier/prettier */
import { MigrationInterface, QueryRunner } from "typeorm";

export class UserSettingUniqueOrigin1774267503282 implements MigrationInterface {
    name = 'UserSettingUniqueOrigin1774267503282'

    public async up(queryRunner: QueryRunner): Promise<void> {
       
        await queryRunner.query(`ALTER TABLE "USER_SETTINGS" DROP CONSTRAINT "UQ_08203cd4fd19311b124c3e6683f"`);
        
        await queryRunner.query(`ALTER TABLE "USER_SETTINGS" ADD CONSTRAINT "UQ_ec4220dd0c93033a273e7fc888b" UNIQUE ("USER_ID", "KEY", "ORIGIN")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
       
        await queryRunner.query(`ALTER TABLE "USER_SETTINGS" DROP CONSTRAINT "UQ_ec4220dd0c93033a273e7fc888b"`);
        
        await queryRunner.query(`ALTER TABLE "USER_SETTINGS" ADD CONSTRAINT "UQ_08203cd4fd19311b124c3e6683f" UNIQUE ("USER_ID", "KEY")`);
        
    }

}
