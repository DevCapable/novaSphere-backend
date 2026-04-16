import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLecturerAccountEntity1776350092228 implements MigrationInterface {
    name = 'CreateLecturerAccountEntity1776350092228'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ACCOUNT_LECTURERS" ("ACCOUNT_ID" number NOT NULL, "FIRST_NAME" varchar2(255) NOT NULL, "LAST_NAME" varchar2(255) NOT NULL, "OTHER_NAMES" varchar2(255), "TITLE" varchar2(255), "DOB" timestamp NOT NULL, "GENDER" varchar2(255) NOT NULL, "STAFF_NUMBER" varchar2(255), "IPPIS_NUMBER" varchar2(255), "NIN_NUMBER" varchar2(255), "PENSION_FUND_ADMIN" varchar2(255), "RSA_NUMBER" varchar2(255), "RANK" varchar2(50) DEFAULT 'GRADUATE_ASSISTANT' NOT NULL, "HIGHEST_QUALIFICATION" varchar2(255), "AREA_OF_SPECIALIZATION" varchar2(255), "GOOGLE_SCHOLAR_LINK" varchar2(255), "ORCID_ID" varchar2(255), "EMPLOYMENT_TYPE" varchar2(50) DEFAULT 'FULL_TIME' NOT NULL, "DATE_OF_FIRST_APPOINTMENT" timestamp, "DATE_OF_PRESENT_APPOINTMENT" timestamp, "DATE_OF_CONFIRMATION" timestamp, "PHONE_NUMBER" varchar2(255), "COUNTRY_ID" number, "NATIONALITY_ID" number NOT NULL, "STATE_OF_ORIGIN_ID" number, "LGA_ID" number, "RESIDENTIAL_ADDRESS" varchar2(1000), "NEXT_OF_KIN_NAME" varchar2(255), "NEXT_OF_KIN_PHONE" varchar2(255), "NEXT_OF_KIN_ADDRESS" varchar2(255), "NEXT_OF_KIN_RELATIONSHIP" varchar2(255), "PHOTO" varchar2(255), "SIGNATURE" varchar2(255), CONSTRAINT "UQ_2f3b796af93233b4b6fcf0349e0" UNIQUE ("STAFF_NUMBER"), CONSTRAINT "PK_3bf645c5fc910735ca5a81cab1d" PRIMARY KEY ("ACCOUNT_ID"))`);
        await queryRunner.query(`ALTER TABLE "ACCOUNT_LECTURERS" ADD CONSTRAINT "FK_3bf645c5fc910735ca5a81cab1d" FOREIGN KEY ("ACCOUNT_ID") REFERENCES "ACCOUNTS" ("ID")`);
        await queryRunner.query(`ALTER TABLE "ACCOUNT_LECTURERS" ADD CONSTRAINT "FK_203d7cf84e097f9de55aa2498c6" FOREIGN KEY ("COUNTRY_ID") REFERENCES "BASE_RECORDS" ("ID")`);
        await queryRunner.query(`ALTER TABLE "ACCOUNT_LECTURERS" ADD CONSTRAINT "FK_1b8fd7bf27da16a6e0fb48ee2ba" FOREIGN KEY ("NATIONALITY_ID") REFERENCES "BASE_RECORDS" ("ID")`);
        await queryRunner.query(`ALTER TABLE "ACCOUNT_LECTURERS" ADD CONSTRAINT "FK_51fb616e83f6d0ccca7a2b9a1dd" FOREIGN KEY ("STATE_OF_ORIGIN_ID") REFERENCES "BASE_RECORDS" ("ID")`);
        await queryRunner.query(`ALTER TABLE "ACCOUNT_LECTURERS" ADD CONSTRAINT "FK_708f794279d08e9ed79fe8b5101" FOREIGN KEY ("LGA_ID") REFERENCES "BASE_RECORDS" ("ID")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ACCOUNT_LECTURERS" DROP CONSTRAINT "FK_708f794279d08e9ed79fe8b5101"`);
        await queryRunner.query(`ALTER TABLE "ACCOUNT_LECTURERS" DROP CONSTRAINT "FK_51fb616e83f6d0ccca7a2b9a1dd"`);
        await queryRunner.query(`ALTER TABLE "ACCOUNT_LECTURERS" DROP CONSTRAINT "FK_1b8fd7bf27da16a6e0fb48ee2ba"`);
        await queryRunner.query(`ALTER TABLE "ACCOUNT_LECTURERS" DROP CONSTRAINT "FK_203d7cf84e097f9de55aa2498c6"`);
        await queryRunner.query(`ALTER TABLE "ACCOUNT_LECTURERS" DROP CONSTRAINT "FK_3bf645c5fc910735ca5a81cab1d"`);
        await queryRunner.query(`DROP TABLE "ACCOUNT_LECTURERS"`);
    }

}
