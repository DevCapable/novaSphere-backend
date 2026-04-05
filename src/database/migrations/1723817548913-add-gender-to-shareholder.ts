import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGenderToShareholder1723817548913 implements MigrationInterface {
  name = 'AddGenderToShareholder1723817548913';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "SHAREHOLDERS"
        ADD "GENDER" varchar2(255) NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "SHAREHOLDERS" DROP COLUMN "GENDER"`);
  }
}
