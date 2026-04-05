import { MigrationInterface, QueryRunner } from 'typeorm';

export class Ncec1719461598591 implements MigrationInterface {
  name = 'Ncec1719461598591';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "NCEC_APPLICATIONS" ADD "OLD_ID" number`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "NCEC_APPLICATIONS" DROP COLUMN "OLD_ID"`,
    );
  }
}
