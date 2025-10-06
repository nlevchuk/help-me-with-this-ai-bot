import 'reflect-metadata'
import { DataSource } from 'typeorm'

import { dbConfig } from './config/db.js'
import { User } from './entity/User.js'
import { InvitationToken } from './entity/InvitationToken.js'
import { ApiStat } from './entity/ApiStat.js'

const {
  host,
  port,
  username,
  password,
  database,
  ssl_cert_content,
} = dbConfig;

export const dataSource = new DataSource({
  host,
  port,
  username,
  password,
  database,
  type: 'postgres',
  ssl: {
    rejectUnauthorized: true,
    ca: ssl_cert_content,
  },
  entities: [User, InvitationToken, ApiStat],
  migrations: ['migrations/*.{ts,js}'],
  logging: process.env.NODE_ENV === 'development',
});
