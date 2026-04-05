import { MigrationInterface, QueryRunner } from 'typeorm';

export class Advert1719898422209 implements MigrationInterface {
  name = 'Advert1719898422209';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ADVERTS" DROP COLUMN "DESCRIPTION"`);
    await queryRunner.query(`ALTER TABLE "ADVERTS" ADD "DESCRIPTION" clob`);
    await queryRunner.query(
      `ALTER TABLE "ADVERTS" DROP COLUMN "METHOD_OF_APPLICATION"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ADVERTS" ADD "METHOD_OF_APPLICATION" clob`,
    );
    await queryRunner.query(`ALTER TABLE "ADVERTS" DROP COLUMN "REQUIREMENTS"`);
    await queryRunner.query(`ALTER TABLE "ADVERTS" ADD "REQUIREMENTS" clob`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ADVERTS" DROP COLUMN "REQUIREMENTS"`);
    await queryRunner.query(
      `ALTER TABLE "ADVERTS" ADD "REQUIREMENTS" varchar2(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "ADVERTS" DROP COLUMN "METHOD_OF_APPLICATION"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ADVERTS" ADD "METHOD_OF_APPLICATION" varchar2(255)`,
    );
    await queryRunner.query(`ALTER TABLE "ADVERTS" DROP COLUMN "DESCRIPTION"`);
    await queryRunner.query(
      `ALTER TABLE "ADVERTS" ADD "DESCRIPTION" varchar2(255)`,
    );
  }
}
