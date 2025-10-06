import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddDefaultApiCallsLimitToInvitationTokens1703806375630 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'invitationTokens',
      new TableColumn({
        name: 'defaultApiCallsLimit',
        type: 'integer',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('invitationTokens', 'defaultApiCallsLimit');
  }
}
