import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAgentReserveTable1739634483383 implements MigrationInterface {
    name = 'CreateAgentReserveTable1739634483383'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`agent_reserve\` (\`id\` int NOT NULL AUTO_INCREMENT, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NULL, \`email\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, \`password\` text NOT NULL, \`company\` varchar(255) NOT NULL, \`address\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`agent_reserve\``);
    }

}
