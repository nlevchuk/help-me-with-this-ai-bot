import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'uuid' })
  invitationTokenId: string

  @Column({ unique: true })
  telegramId: string

  @Column()
  apiCallsCount: number

  @Column()
  apiCallsLimit: number

  @Column()
  maxMessageLength: number

  @Column({ default: true })
  isActive: boolean;

  @Column()
  translationLanguage: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
