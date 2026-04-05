import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInstitutionEntity1744020654923 implements MigrationInterface {
  name = 'CreateInstitutionEntity1744020654923';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "ACCOUNT_INSTITUTION"
                             (
                                 "ACCOUNT_ID"                 number NOT NULL,
                                 "INSTITUTION_NAME"           varchar2(255) NOT NULL,
                                 "INSTITUTION_TYPE"           varchar2(255) NOT NULL,
                                 "REGISTRATION_NUMBER"        varchar2(255) NOT NULL,
                                 "DATE_OF_ESTABLISHMENT"      date   NOT NULL,
                                 "ADDRESS"                    varchar2(1000) NOT NULL,
                                 "CONTACT_NUMBER"             varchar2(20) NOT NULL,
                                 "EMAIL"                      varchar2(100) NOT NULL,
                                 "WEBSITE"                    varchar2(255),
                                 "REPRESENTATIVE_NAME"        varchar2(255) NOT NULL,
                                 "REPRESENTATIVE_DESIGNATION" varchar2(255) NOT NULL,
                                 CONSTRAINT "PK_2bf9feef9427882fdb25a135209" PRIMARY KEY ("ACCOUNT_ID")
                             )`);

    await queryRunner.query(`ALTER TABLE "ACCOUNT_INSTITUTION"
        ADD CONSTRAINT "FK_2bf9feef9427882fdb25a135209" FOREIGN KEY ("ACCOUNT_ID") REFERENCES "ACCOUNTS" ("ID")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ACCOUNT_INSTITUTION" DROP CONSTRAINT "FK_2bf9feef9427882fdb25a135209"`,
    );

    await queryRunner.query(`DROP TABLE "ACCOUNT_INSTITUTION"`);
  }
}
