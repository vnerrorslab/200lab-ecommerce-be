import { Router, type Request, type Response } from 'express'

import { CreateBrandDTO } from '../dto/brand_creation'
import { UpdateBrandDTO } from '../dto/brand_update'
import { IBrandUseCase } from '~/modules/brand/interfaces/usecase'
import { BrandListingConditionDTO } from '~/modules/brand/model/brand'
import { Paging } from '~/shared/dto/paging'

export class BrandService {
  constructor(readonly brandUseCase: IBrandUseCase) {}

  async insert_brand(req: Request, res: Response) {
    try {
      const { name, logo, tag_line, description } = req.body
      const brandDTO = new CreateBrandDTO(name, logo, tag_line, description)

      const brand = await this.brandUseCase.createBrand(brandDTO)

      res.status(201).send({ code: 201, message: 'insert brand successful', data: brand })
    } catch (error: any) {
      res.status(400).send({ error: error.message })
    }
  }

  async update_brand(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { name, logo, tag_line, description, status } = req.body
      const brandDTO = new UpdateBrandDTO(name, logo, tag_line, description, status)

      const brand = await this.brandUseCase.updateBrand(id, brandDTO)

      res.status(200).send({ code: 200, message: 'update brand successful', data: brand })
    } catch (error: any) {
      res.status(400).send({ error: error.message })
    }
  }

  async delete_brand(req: Request, res: Response) {
    try {
      const { id } = req.params

      await this.brandUseCase.deleteBrand(id)

      res.status(200).send({ code: 200, message: 'delete brand successful' })
    } catch (error: any) {
      res.status(400).send({ error: error.message })
    }
  }

  async listing_brand(req: Request, res: Response) {
    try {
      const searchStr = (req.query.searchStr as string) || ''
      const condition = new BrandListingConditionDTO(searchStr)

      //phân trang nè
      const limit = parseInt(req.query.limit as string) || 10
      const page = parseInt(req.query.page as string) || 1

      const paging: Paging = new Paging(page, 0, limit)

      const { brands, total_pages } = await this.brandUseCase.listingBrand(condition, paging)

      const total = Math.ceil(total_pages / limit)

      return res.status(200).json({ code: 200, message: 'list brands', data: brands, total_pages: total })
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  }

  async detail_brand(req: Request, res: Response) {
    try {
      const { id } = req.params

      const brand = await this.brandUseCase.detailBrand(id)

      if (!brand) {
        return res.status(404).json({ code: 404, message: 'brand not found' })
      }

      return res.status(200).json({ code: 200, message: 'brand detail', data: brand })
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  }

  setupRoutes(): Router {
    const router = Router()

    router.post('/brands', this.insert_brand.bind(this))

    router.put('/brands/:id', this.update_brand.bind(this))

    router.delete('/brands/:id', this.delete_brand.bind(this))

    router.get('/brands', this.listing_brand.bind(this))

    router.get('/brands/:id', this.detail_brand.bind(this))

    return router
  }
}
