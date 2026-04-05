import { MigrationInterface, QueryRunner } from 'typeorm';

export class ComunityVendorNogicNumber1753273292066 implements MigrationInterface {
  name = 'ComunityVendorNogicNumber1753273292066';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ACCOUNT_COMMUNITY_VENDORS" ADD "NOGIC_NUMBER" varchar2(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ACCOUNT_COMMUNITY_VENDORS" DROP COLUMN "NOGIC_NUMBER"`,
    );
  }
}
