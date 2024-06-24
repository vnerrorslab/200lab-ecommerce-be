import dotenv from 'dotenv'
import express, { type Express, type Request, type Response } from 'express'
import { Sequelize } from 'sequelize'
import { initUsers } from './modules/users/infras/repository/dto/user'
import { UserService } from './modules/users/infras/transport/rest/routes'
import { UserUseCase } from './modules/users/usecase/user_usecase'
import { MySQLUserRepository } from './modules/users/infras/repository/mysql_user_repository'
import { BrandService } from './modules/brand/infras/transport/rest/routes'
import { BrandUseCase } from './modules/brand/usecase/brand_usecase'
import { MySQLBrandRepository } from './modules/brand/infras/repository/mysql_brand_repository'
import { initBrands } from './modules/brand/infras/repository/dto/brand'
import { initCategories } from './modules/categories/infras/repository/dto/category'
import { CategoryService } from './modules/categories/infras/transport/rest/routes'
import { CategoryUseCase } from './modules/categories/usecase/category_usecase'
import { MySQLCategoryRepository } from './modules/categories/infras/repository/mysql_category_repository'
import { initProducts } from './modules/products/infras/repository/dto/product'
import { ProductService } from './modules/products/infras/transport/rest/routes'
import { ProductUseCase } from './modules/products/usecase/product_usecase'
import { MySQLProductsRepository } from './modules/products/infras/repository/mysql_product_repository'

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 8080

const sequelize = new Sequelize({
  database: process.env.DB_NAME || '',
  username: process.env.DB_USERNAME || '',
  password: process.env.DB_PASSWORD || '',
  host: process.env.DB_HOST || '',
  dialect: 'mysql',
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: false
})

;(async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection successfully.')
    initUsers(sequelize)
    initBrands(sequelize)
    initCategories(sequelize)
    initProducts(sequelize)

    app.get('/', (req: Request, res: Response) => {
      res.send('200lab Server')
    })

    app.use(express.json())

    const services = [
      new UserService(new UserUseCase(new MySQLUserRepository(sequelize))),
      new BrandService(new BrandUseCase(new MySQLBrandRepository(sequelize))),
      new CategoryService(new CategoryUseCase(new MySQLCategoryRepository(sequelize))),
      new ProductService(new ProductUseCase(new MySQLProductsRepository(sequelize)))
    ]

    services.forEach((service) => {
      app.use('/v1', service.setupRoutes())
    })

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`)
    })
  } catch (error) {
    console.error('Unable to connect to the database:', error)
    process.exit(1)
  }
})()
