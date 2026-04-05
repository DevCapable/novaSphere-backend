import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAdditionalFieldsNctrcEntity1741170370886 implements MigrationInterface {
  name = 'AddAdditionalFieldsNctrcEntity1741170370886';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "NCTRC_APPLICATIONS"
        ADD "CONTACT_NAME" VARCHAR2(255)`);
    await queryRunner.query(`ALTER TABLE "NCTRC_APPLICATIONS"
        ADD "CONTACT_ADDRESS" VARCHAR2(255)`);
    await queryRunner.query(`ALTER TABLE "NCTRC_APPLICATIONS"
        ADD "CONTACT_PHONE_NUMBER" VARCHAR2(255)`);
    await queryRunner.query(`ALTER TABLE "NCTRC_APPLICATIONS"
        ADD "CONTACT_EMAIL_ADDRESS" VARCHAR2(255)`);
    await queryRunner.query(`ALTER TABLE "NCTRC_APPLICATIONS"
        ADD "OTHER_DETAILS" VARCHAR2(3000)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "NCTRC_APPLICATIONS" DROP COLUMN "OTHER_DETAILS"`,
    );
    await queryRunner.query(
      `ALTER TABLE "NCTRC_APPLICATIONS" DROP COLUMN "CONTACT_EMAIL_ADDRESS"`,
    );
    await queryRunner.query(
      `ALTER TABLE "NCTRC_APPLICATIONS" DROP COLUMN "CONTACT_PHONE_NUMBER"`,
    );
    await queryRunner.query(
      `ALTER TABLE "NCTRC_APPLICATIONS" DROP COLUMN "CONTACT_ADDRESS"`,
    );
    await queryRunner.query(
      `ALTER TABLE "NCTRC_APPLICATIONS" DROP COLUMN "CONTACT_NAME"`,
    );
  }
}
