import express, { Router, type Request, type Response } from 'express'
import type { IInventoryUseCase } from '../../../interfaces/usecase'
import { CreateInventoryDTO } from '../dto/inventory_create'
import { UpdateInventoryDTO } from '../dto/inventory_update'
import { BaseStatus } from '~/shared/dto/status'
export class InventoryService {
  constructor(readonly inventoryUseCase: IInventoryUseCase) {}

  async listAllInventory(req: Request, res: Response) {
    try {
      const inventories = await this.inventoryUseCase.listAllInventory()

      return res.status(200).json({ code: 200, message: 'list inventories', data: inventories })
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  }
  async createInventory(req: Request, res: Response) {
    try {
      const { productId, quantity, costPrice, status = BaseStatus.OUTOFSTOCK, createdAt, updatedAt } = req.body
      const invDTO = new CreateInventoryDTO(
        productId,
        quantity,
        costPrice,
        status,
        new Date(createdAt),
        new Date(updatedAt)
      )

      const inventory = await this.inventoryUseCase.createInventory(invDTO)

      res.status(201).send({ code: 201, message: 'insert inventory successful', data: inventory })
    } catch (error: any) {
      res.status(400).send({ error: error.message })
    }
  }

  async updateInventory(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { productId, quantity, costPrice, status, updatedAt } = req.body

      const invDTO = new UpdateInventoryDTO(productId, quantity, costPrice, status, new Date(updatedAt))

      const inventory = await this.inventoryUseCase.updateInventory(id, invDTO)

      return res.status(200).send({ code: 200, message: 'update inventory successful', data: inventory })
    } catch (error: any) {
      return res.status(400).send({ error: error.message })
    }
  }

  async checkInventory(req: Request, res: Response) {
    try {
      const isAvilable = await this.inventoryUseCase.checkInventory(req.body)

      return res.status(200).json({
        code: 200,
        message: 'list products',
        isAvilable: isAvilable
      })
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  }

  setupRoutes(): Router {
    const router = Router()

    router.get('/inventories/list', this.listAllInventory.bind(this))
    router.post('/inventories/check', this.checkInventory.bind(this))
    router.post('/inventories/create', this.createInventory.bind(this))
    router.put('/inventories/update/:id', this.updateInventory.bind(this))

    return router
  }
}
