import { Router, type Request, type Response } from 'express'
import { CreateProductDTO } from '../dto/product_creation'
import { UpdateProductDTO } from '../dto/product_update'
import { Paging } from '~/shared/dto/paging'
import { IProductUseCase } from '~/modules/products/interfaces/usecase'
import { ProductListingConditionDTO } from '~/modules/products/model/product'

export class ProductService {
  constructor(readonly productUseCase: IProductUseCase) {}

  async insert_product(req: Request, res: Response) {
    try {
      const { name, image_url, price, quantity, brand_id, category_id, description, created_by, updated_by } = req.body
      const productDTO = new CreateProductDTO(
        name,
        image_url,
        price,
        quantity,
        brand_id,
        category_id,
        description,
        created_by,
        updated_by
      )

      const product = await this.productUseCase.createProduct(productDTO)

      res.status(201).send({
        code: 201,
        message: 'insert product successful',
        data: product
      })
    } catch (error: any) {
      res.status(400).send({ error: error.message })
    }
  }

  async update_product(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { name, image_url, price, quantity, brand_id, category_id, description, status, created_by, updated_by } =
        req.body
      const productDTO = new UpdateProductDTO(
        name,
        image_url,
        price,
        quantity,
        brand_id,
        category_id,
        description,
        status,
        created_by,
        updated_by
      )

      const product = await this.productUseCase.updateProduct(id, productDTO)

      res.status(200).send({
        code: 200,
        message: 'update product successful',
        data: product
      })
    } catch (error: any) {
      res.status(400).send({ error: error.message })
    }
  }

  async delete_product(req: Request, res: Response) {
    try {
      const { id } = req.params

      await this.productUseCase.deleteProduct(id)

      res.status(200).send({ code: 200, message: 'delete product successful' })
    } catch (error: any) {
      res.status(400).send({ error: error.message })
    }
  }

  async listing_product(req: Request, res: Response) {
    try {
      const { searchStr } = req.query
      const condition = new ProductListingConditionDTO(searchStr as string)

      //phân trang nè
      const limit = parseInt(req.query.limit as string) || 10
      const page = parseInt(req.query.page as string) || 1

      const paging: Paging = new Paging(page, 0, limit)

      const { products, total_pages } = await this.productUseCase.listingProduct(condition, paging)

      const total = Math.ceil(total_pages / limit)

      return res.status(200).json({
        code: 200,
        message: 'list products',
        data: products,
        total_pages: total
      })
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  }

  async detail_product(req: Request, res: Response) {
    try {
      const { id } = req.params

      const product = await this.productUseCase.detailProduct(id)

      if (!product) {
        return res.status(404).json({ code: 404, message: 'product not found' })
      }

      return res.status(200).json({ code: 200, message: 'product detail', data: product })
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  }

  setupRoutes(): Router {
    const router = Router()

    router.post('/products', this.insert_product.bind(this))

    router.put('/products/:id', this.update_product.bind(this))

    router.delete('/products/:id', this.delete_product.bind(this))

    router.get('/products', this.listing_product.bind(this))

    router.get('/products/:id', this.detail_product.bind(this))

    return router
  }
}
