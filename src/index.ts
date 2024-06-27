import dotenv from 'dotenv'
import express, { type Express, type Request, type Response } from 'express'
import { Sequelize } from 'sequelize'
import { initUsers } from './modules/users/infras/repository/dto/user'
import { UserService } from './modules/users/infras/transport/rest/routes'
import { UserUseCase } from './modules/users/usecase/user_usecase'
import { MySQLUserRepository } from './modules/users/infras/repository/mysql_user_repository'
import { BrandService } from './modules/brands/infras/transport/rest/routes'
import { BrandUseCase } from './modules/brands/usecase/brand_usecase'
import { MySQLBrandRepository } from './modules/brands/infras/repository/mysql_brand_repository'
import { initBrands } from './modules/brands/infras/repository/dto/brand'
import { initCategories } from './modules/categories/infras/repository/dto/category'
import { CategoryService } from './modules/categories/infras/transport/rest/routes'
import { CategoryUseCase } from './modules/categories/usecase/category_usecase'
import { MySQLCategoryRepository } from './modules/categories/infras/repository/mysql_category_repository'
import { initProducts } from './modules/products/infras/repository/dto/product'
import { ProductService } from './modules/products/infras/transport/rest/routes'
import { ProductUseCase } from './modules/products/usecase/product_usecase'
import { MySQLProductsRepository } from './modules/products/infras/repository/mysql_product_repository'
import { initCarts } from './modules/carts/infras/repository/dto/cart'
import { CartService } from './modules/carts/infras/transport/rest/routes'
import { CartUseCase } from './modules/carts/usecase/cart_usecase'
import { MySQLCartRepository } from './modules/carts/infras/repository/mysql_cart_repository'
import { initAuth } from './modules/auth/infras/repository/dto/auth'
import { initPermission } from './modules/auth/infras/repository/dto/user_permission'
import { AuthService } from './modules/auth/infras/transport/rest/routes'
import { AuthUseCase } from './modules/auth/usecase/user_usecase'
import { MySQLAuthRepository } from './modules/auth/infras/repository/mysql_auth_repository'
import { JwtTokenService } from './shared/token/jwt-token-service'
import { initImages } from './modules/images/infras/repository/dto/image'
import { ImageService } from './modules/images/infras/transport/rest/routes'
import { ImageUseCase } from './modules/images/usecase/image_usecase'
import { MySQLImagesRepository } from './modules/images/infras/repository/mysql_image_repository'

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
    // check connection to database
    await sequelize.authenticate()
    console.log('Connection successfully.')
    initUsers(sequelize)
    initBrands(sequelize)
    initCategories(sequelize)
    initProducts(sequelize)
    initCarts(sequelize)
    initAuth(sequelize)
    initPermission(sequelize)
    initImages(sequelize)

    // check API
    app.get('/', (req: Request, res: Response) => {
      res.send('200lab Server')
    })

    app.use(express.json())

    const tokenService = new JwtTokenService(process.env.JWT_SECRET_KEY || '200', '1h')

    const services = [
      new UserService(new UserUseCase(new MySQLUserRepository(sequelize))),
      new BrandService(new BrandUseCase(new MySQLBrandRepository(sequelize))),
      new CategoryService(new CategoryUseCase(new MySQLCategoryRepository(sequelize))),
      new ProductService(new ProductUseCase(new MySQLProductsRepository(sequelize))),
      new CartService(new CartUseCase(new MySQLCartRepository(sequelize))),
      new AuthService(
        new AuthUseCase(new MySQLAuthRepository(sequelize), tokenService),
        tokenService,
        new MySQLAuthRepository(sequelize)
      ),
      new ImageService(new ImageUseCase(new MySQLImagesRepository(sequelize)))
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
