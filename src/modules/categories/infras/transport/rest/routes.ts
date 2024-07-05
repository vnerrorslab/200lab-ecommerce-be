import { Router, type Request, type Response } from 'express'
import { CreateCategoryDTO } from '../dto/category_creation'
import { UpdateCategoryDTO } from '../dto/category_update'
import { Paging } from '~/shared/dto/paging'
import { ICategoryUseCase } from '~/modules/categories/interfaces/usecase'
import { CategoryListingConditionDTO } from '~/modules/categories/model/category'

export class CategoryService {
  constructor(readonly categoryUseCase: ICategoryUseCase) {}

  async insert_category(req: Request, res: Response) {
    try {
      const { name, description, parentId } = req.body
      const categoryDTO = new CreateCategoryDTO(name, description, parentId)

      const category = await this.categoryUseCase.createCategory(categoryDTO)

      res.status(201).send({ code: 201, message: 'insert category successful', data: category })
    } catch (error: any) {
      res.status(400).send({ error: error.message })
    }
  }

  async update_category(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { name, description, parentId, status } = req.body
      const categoryDTO = new UpdateCategoryDTO(name, description, parentId, status)

      const category = await this.categoryUseCase.updateCategory(id, categoryDTO)

      res.status(200).send({ code: 200, message: 'update category successful', data: category })
    } catch (error: any) {
      res.status(400).send({ error: error.message })
    }
  }

  async delete_category(req: Request, res: Response) {
    try {
      const { id } = req.params

      await this.categoryUseCase.deleteCategory(id)

      res.status(200).send({ code: 200, message: 'delete category successful' })
    } catch (error: any) {
      res.status(400).send({ error: error.message })
    }
  }

  async listing_category(req: Request, res: Response) {
    try {
      const { searchStr } = req.query
      const condition = new CategoryListingConditionDTO(searchStr as string)

      //phân trang á
      const limit = parseInt(req.query.limit as string) || 10
      const page = parseInt(req.query.page as string) || 1

      const paging: Paging = new Paging(page, 0, limit)

      const { categorys, total_pages } = await this.categoryUseCase.listingCategory(condition, paging)

      const total = Math.ceil(total_pages / limit)

      return res.status(200).json({ code: 200, message: 'list categorys', data: categorys, total_pages: total })
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  }

  async detail_category(req: Request, res: Response) {
    try {
      const { id } = req.params

      const category = await this.categoryUseCase.detailCategory(id)

      if (!category) {
        return res.status(404).json({ code: 404, message: 'category not found' })
      }

      return res.status(200).json({ code: 200, message: 'category detail', data: category })
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  }

  setupRoutes(): Router {
    const router = Router()

    router.post('/categories', this.insert_category.bind(this))

    router.put('/categories/:id', this.update_category.bind(this))

    router.delete('/categories/:id', this.delete_category.bind(this))

    router.get('/categories', this.listing_category.bind(this))

    router.get('/categories/:id', this.detail_category.bind(this))

    return router
  }
}
