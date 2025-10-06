import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddDefaultMaxMessageLengthToInvitationTokens1704812142875 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'invitationTokens',
      new TableColumn({
        name: 'defaultMaxMessageLength',
        type: 'integer',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('invitationTokens', 'defaultMaxMessageLength');
  }
}
