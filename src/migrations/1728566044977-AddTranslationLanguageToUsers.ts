import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddTranslationLanguageToUsers1727544457268 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'translationLanguage',
        type: 'varchar',
        length: '32',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'translationLanguage');
  }
}
