import { Sequelize } from 'sequelize'
import { config } from 'dotenv'

config()

export const sequelize = new Sequelize({
  database: process.env.DB_NAME || '',
  username: process.env.DB_USERNAME || '',
  password: process.env.DB_PASSWORD || '',
  host: process.env.DB_HOST || '',
  port: parseInt(process.env.DB_PORT as string),
  dialect: 'mysql',
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: false
})
