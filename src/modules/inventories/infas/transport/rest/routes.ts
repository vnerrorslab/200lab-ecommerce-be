import { NextFunction, Router, type Request, type Response } from 'express'
import { InventorySearchDTO } from '~/modules/inventories/model/inventory'
import { Paging } from '~/shared/dto/paging'
import { Actions, BaseStatus, Roles } from '~/shared/dto/status'
import { authorizeMiddleWare } from '~/shared/middleware/authorization-middleware'
import type { IInventoryUseCase } from '../../../interfaces/usecase'
import { CreateInventoryDTO } from '../dto/inventory_create'
import { UpdateInventoryDTO } from '../dto/inventory_update'
export class InventoryService {
  constructor(readonly inventoryUseCase: IInventoryUseCase) {}

  async listAllInventory(req: Request, res: Response) {
    try {
      const { searchStr } = req.query
      const condition = new InventorySearchDTO(searchStr as string)

      const limit = parseInt(req.query.limit as string) || 10
      const page = parseInt(req.query.page as string) || 1

      const paging: Paging = new Paging(page, 0, limit)

      const { inventories, total_pages } = await this.inventoryUseCase.listAllInventory(condition, paging)

      const total = Math.ceil(total_pages / limit)

      return res.status(200).json({ code: 200, message: 'list inventories', data: inventories, total_pages: total })
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  }
  async createInventory(req: Request, res: Response) {
    try {
      const { productId, quantity, costPrice, status = BaseStatus.OUTOFSTOCK } = req.body
      const invDTO = new CreateInventoryDTO(productId, quantity, costPrice, status, new Date(), new Date())

      const inventory = await this.inventoryUseCase.createInventory(invDTO)

      res.status(201).send({ code: 201, message: 'insert inventory successful', data: inventory })
    } catch (error: any) {
      res.status(400).send({ error: error.message })
    }
  }

  async updateInventory(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { productId, quantity, costPrice, status } = req.body

      const invDTO = new UpdateInventoryDTO(productId, quantity, costPrice, status, new Date())

      const inventory = await this.inventoryUseCase.updateInventory(id, invDTO)

      return res.status(200).send({ code: 200, message: 'update inventory successful', data: inventory })
    } catch (error: any) {
      return res.status(400).send({ error: error.message })
    }
  }

  async checkInventory(req: Request, res: Response) {
    try {
      const checkMessage = await this.inventoryUseCase.checkInventory(req.body)

      return res.status(200).json({
        code: 200,
        message: checkMessage
      })
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  }

  setupRoutes(auth: (req: Request, res: Response, next: NextFunction) => void): Router {
    const router = Router()

    router.get('/inventories', auth, authorizeMiddleWare([Roles.ADMIN], Actions.READ), this.listAllInventory.bind(this))
    router.post(
      '/inventories/check',
      auth,
      authorizeMiddleWare([Roles.ADMIN, Roles.USER], Actions.READ),
      this.checkInventory.bind(this)
    )
    router.post(
      '/inventories',
      auth,
      authorizeMiddleWare([Roles.ADMIN], Actions.CREATED),
      this.createInventory.bind(this)
    )
    router.put(
      '/inventories/:id',
      auth,
      authorizeMiddleWare([Roles.ADMIN], Actions.UPDATED),
      this.updateInventory.bind(this)
    )

    return router
  }
}
