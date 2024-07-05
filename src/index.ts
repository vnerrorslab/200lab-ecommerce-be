import dotenv from 'dotenv'
import express, { type Express, type Request, type Response } from 'express'
import { sequelize } from './infras/sequelize'
import { initAuth } from './modules/auth/infras/repository/dto/auth'
import { initPermission } from './modules/auth/infras/repository/dto/user-permission'
import { MySQLAuthRepository } from './modules/auth/infras/repository/mysql-auth-repository'
import { authService } from './modules/auth/module'
import { AuthUseCase } from './modules/auth/usecase/auth-usecase'
import { initBrands } from './modules/brands/infras/repository/dto/brand'
import { initImages as initImagesInBrand } from './modules/brands/infras/rpc-client/dto/image'
import { brandService } from './modules/brands/module'
import { initCarts } from './modules/carts/infras/repository/dto/cart'
import { initProducts as initProductsInCart } from './modules/carts/infras/rpc-client/dto/product'
import { cartService } from './modules/carts/module'
import { initCategories } from './modules/categories/infras/repository/dto/category'
import { categoryService } from './modules/categories/module'
import { initImages } from './modules/images/infras/repository/dto/image'
import { imageService } from './modules/images/module'
import { initInventory } from './modules/inventories/infas/repository/dto/inventory'
import { inventoryService } from './modules/inventories/module'
import { orderService } from './modules/order/module'
import { initProducts } from './modules/products/infras/repository/dto/product'
import { initBrands as initBrandInProduct } from './modules/products/infras/rpc-client/dto/brand'
import { initCategories as initCategoryInProduct } from './modules/products/infras/rpc-client/dto/category'
import { initImages as initImagesInProduct } from './modules/products/infras/rpc-client/dto/image'
import { productService } from './modules/products/module'
import { initUsers } from './modules/users/infras/repository/dto/user'
import { initImages as initImagesInUser } from './modules/users/infras/rpc-client/dto/image'
import { userService } from './modules/users/module'
import { authMiddleware } from './shared/middleware/auth-middleware'
import { JwtTokenService } from './shared/token/jwt-token-service'
import { initOrder } from './modules/order/infas/repository/dto/order'
import { initOrderItem } from './modules/order/infas/repository/dto/order-item'
import { initInventoryAdapter } from './modules/order/infas/rpc-client/dto/inventory'

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 8080

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
    initInventory(sequelize)
    initAuth(sequelize)
    initPermission(sequelize)
    initImages(sequelize)
    initImagesInUser(sequelize)
    initImagesInProduct(sequelize)
    initImagesInBrand(sequelize)
    initBrandInProduct(sequelize)
    initCategoryInProduct(sequelize)
    initProductsInCart(sequelize)
    initOrder(sequelize)
    initOrderItem(sequelize)
    initInventoryAdapter(sequelize)

    // check API
    app.get('/', (req: Request, res: Response) => {
      res.send('200lab Server')
    })

    app.use(express.json())

    const tokenService = new JwtTokenService(process.env.JWT_SECRET_KEY || '200', '1h')
    const auth = authMiddleware(new AuthUseCase(new MySQLAuthRepository(sequelize), tokenService))

    app.use('/v1', userService.setupRoutes())
    app.use('/v1', authService.setupRoutes(auth))
    app.use('/v1', cartService.setupRoutes(auth))
    app.use('/v1', brandService.setupRoutes())
    app.use('/v1', categoryService.setupRoutes())
    app.use('/v1', imageService.setupRoutes())
    app.use('/v1', inventoryService.setupRoutes())
    app.use('/v1', productService.setupRoutes())
    app.use('/v1', orderService.setupRoutes(auth))

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`)
    })
  } catch (error) {
    console.error('Unable to connect to the database:', error)
    process.exit(1)
  }
})()
