import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOtpTable1739459830420 implements MigrationInterface {
  name = 'CreateOtpTable1739459830420';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`otp\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NULL, \`phone\` varchar(255) NULL, \`code\` int NOT NULL, \`type\` varchar(255) NOT NULL, \`userType\` varchar(255) NOT NULL,\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`otp\``);
  }
}
