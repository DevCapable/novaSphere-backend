import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSkillTrainingJobExperienceEntity1776370455891 implements MigrationInterface {
  name = 'CreateSkillTrainingJobExperienceEntity1776370455891';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "TRAININGS" (
                "ID" NUMBER GENERATED ALWAYS AS IDENTITY,
                "UUID" VARCHAR2(36) NOT NULL,
                "CREATED_AT" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                "UPDATED_AT" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                "ACCOUNT_ID" NUMBER NOT NULL,
                "NAME" VARCHAR2(255) NOT NULL,
                "ORG_NAME" VARCHAR2(255) NOT NULL,
                "COUNTRY_ID" NUMBER NOT NULL,
                "DURATION" NUMBER NOT NULL,
                "YEAR" NUMBER NOT NULL,
                "DESCRIPTION" CLOB,
                CONSTRAINT "UQ_TRAININGS_UUID" UNIQUE ("UUID"),
                CONSTRAINT "PK_TRAININGS_ID" PRIMARY KEY ("ID")
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "SKILLS" (
                "ID" NUMBER GENERATED ALWAYS AS IDENTITY,
                "UUID" VARCHAR2(36) NOT NULL,
                "CREATED_AT" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                "UPDATED_AT" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                "ACCOUNT_ID" NUMBER NOT NULL,
                "CATEGORY_ID" NUMBER NOT NULL,
                "LEVEL_ID" NUMBER NOT NULL,
                "YEAR" NUMBER NOT NULL,
                "DESCRIPTION" CLOB,
                "STATUS" NUMBER,
                CONSTRAINT "UQ_SKILLS_UUID" UNIQUE ("UUID"),
                CONSTRAINT "PK_SKILLS_ID" PRIMARY KEY ("ID")
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "JOB_EXPERIENCES" (
                "ID" NUMBER GENERATED ALWAYS AS IDENTITY,
                "UUID" VARCHAR2(36) NOT NULL,
                "CREATED_AT" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                "UPDATED_AT" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                "ACCOUNT_ID" NUMBER NOT NULL,
                "ORG_ADDRESS" CLOB,
                "JOB_FAMILY_ID" NUMBER NOT NULL,
                "JOB_TYPE_ID" NUMBER NOT NULL,
                "START_DATE" TIMESTAMP,
                "END_DATE" TIMESTAMP,
                "DESCRIPTION" CLOB,
                "COUNTRY_ID" NUMBER NOT NULL,
                "ORG_NAME" VARCHAR2(255),
                CONSTRAINT "UQ_JOB_EXP_UUID" UNIQUE ("UUID"),
                CONSTRAINT "PK_JOB_EXP_ID" PRIMARY KEY ("ID")
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "CERTIFICATIONS" (
                "ID" NUMBER GENERATED ALWAYS AS IDENTITY,
                "UUID" VARCHAR2(36) NOT NULL,
                "CREATED_AT" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                "UPDATED_AT" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                "NAME" VARCHAR2(255) NOT NULL,
                "ACCOUNT_ID" NUMBER NOT NULL,
                "CATEGORY_ID" NUMBER NOT NULL,
                "TYPE_ID" NUMBER NOT NULL,
                "CERTIFICATE_NO" VARCHAR2(255) NOT NULL,
                "YEAR" NUMBER NOT NULL,
                "EXPIRY_YEAR" NUMBER,
                CONSTRAINT "UQ_CERT_UUID" UNIQUE ("UUID"),
                CONSTRAINT "PK_CERT_ID" PRIMARY KEY ("ID")
            )
        `);

    // Foreign Keys
    await queryRunner.query(`
            ALTER TABLE "TRAININGS"
            ADD CONSTRAINT "FK_TRAININGS_ACCOUNT"
            FOREIGN KEY ("ACCOUNT_ID") REFERENCES "ACCOUNTS" ("ID")
        `);

    await queryRunner.query(`
            ALTER TABLE "TRAININGS"
            ADD CONSTRAINT "FK_TRAININGS_COUNTRY"
            FOREIGN KEY ("COUNTRY_ID") REFERENCES "BASE_RECORDS" ("ID")
        `);

    await queryRunner.query(`
            ALTER TABLE "SKILLS"
            ADD CONSTRAINT "FK_SKILLS_ACCOUNT"
            FOREIGN KEY ("ACCOUNT_ID") REFERENCES "ACCOUNTS" ("ID")
        `);

    await queryRunner.query(`
            ALTER TABLE "SKILLS"
            ADD CONSTRAINT "FK_SKILLS_CATEGORY"
            FOREIGN KEY ("CATEGORY_ID") REFERENCES "BASE_RECORDS" ("ID")
        `);

    await queryRunner.query(`
            ALTER TABLE "SKILLS"
            ADD CONSTRAINT "FK_SKILLS_LEVEL"
            FOREIGN KEY ("LEVEL_ID") REFERENCES "BASE_RECORDS" ("ID")
        `);

    await queryRunner.query(`
            ALTER TABLE "JOB_EXPERIENCES"
            ADD CONSTRAINT "FK_JOB_ACCOUNT"
            FOREIGN KEY ("ACCOUNT_ID") REFERENCES "ACCOUNTS" ("ID")
        `);

    await queryRunner.query(`
            ALTER TABLE "JOB_EXPERIENCES"
            ADD CONSTRAINT "FK_JOB_FAMILY"
            FOREIGN KEY ("JOB_FAMILY_ID") REFERENCES "BASE_RECORDS" ("ID")
        `);

    await queryRunner.query(`
            ALTER TABLE "JOB_EXPERIENCES"
            ADD CONSTRAINT "FK_JOB_TYPE"
            FOREIGN KEY ("JOB_TYPE_ID") REFERENCES "BASE_RECORDS" ("ID")
        `);

    await queryRunner.query(`
            ALTER TABLE "JOB_EXPERIENCES"
            ADD CONSTRAINT "FK_JOB_COUNTRY"
            FOREIGN KEY ("COUNTRY_ID") REFERENCES "BASE_RECORDS" ("ID")
        `);

    await queryRunner.query(`
            ALTER TABLE "CERTIFICATIONS"
            ADD CONSTRAINT "FK_CERT_ACCOUNT"
            FOREIGN KEY ("ACCOUNT_ID") REFERENCES "ACCOUNTS" ("ID")
        `);

    await queryRunner.query(`
            ALTER TABLE "CERTIFICATIONS"
            ADD CONSTRAINT "FK_CERT_CATEGORY"
            FOREIGN KEY ("CATEGORY_ID") REFERENCES "BASE_RECORDS" ("ID")
        `);

    await queryRunner.query(`
            ALTER TABLE "CERTIFICATIONS"
            ADD CONSTRAINT "FK_CERT_TYPE"
            FOREIGN KEY ("TYPE_ID") REFERENCES "BASE_RECORDS" ("ID")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "CERTIFICATIONS"`);
    await queryRunner.query(`DROP TABLE "JOB_EXPERIENCES"`);
    await queryRunner.query(`DROP TABLE "SKILLS"`);
    await queryRunner.query(`DROP TABLE "TRAININGS"`);
  }
}
