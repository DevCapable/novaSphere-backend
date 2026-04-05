import { MigrationInterface, QueryRunner } from 'typeorm';

export class Staff1720029026001 implements MigrationInterface {
  name = 'Staff1720029026001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "STAFF" ADD "OLD_ID" number`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "STAFF" DROP COLUMN "OLD_ID"`);
  }
}
