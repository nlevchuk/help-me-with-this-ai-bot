import { readFileSync } from 'fs'

export const dbConfig = {
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  ssl_cert_content: readFileSync(process.env.POSTGRES_CA_CERT_PATH).toString(),
}
