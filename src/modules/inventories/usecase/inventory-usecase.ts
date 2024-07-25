import { BaseStatus } from '~/shared/dto/status'
import type { InventoryCheckDTO } from '../infas/transport/dto/inventory_check'
import type { CreateInventoryDTO } from '../infas/transport/dto/inventory_create'
import type { UpdateInventoryDTO } from '../infas/transport/dto/inventory_update'
import type { IInventoryRepository } from '../interfaces/repository'
import type { IInventoryUseCase } from '../interfaces/usecase'
import type { Inventory, InventorySearchDTO } from '../model/inventory'
import { v4 as uuidv4 } from 'uuid'
import { Paging } from '~/shared/dto/paging'

export class InventoryUseCase implements IInventoryUseCase {
  constructor(readonly inventoryRepository: IInventoryRepository) {}
  async createInventory(dto: CreateInventoryDTO): Promise<string> {
    try {
      dto.validate()
    } catch (error: any) {
      throw new Error(error.message)
    }

    const invId = uuidv4()

    const invExists = await this.inventoryRepository.findByProductId(dto.productId)
    if (invExists) {
      await this.inventoryRepository.update(invExists.id, { ...dto, quantity: dto.quantity + invExists.quantity })
      return invExists.id
    }

    const createInv = {
      id: invId,
      productId: dto.productId,
      quantity: dto.quantity,
      costPrice: dto.costPrice,
      status: dto.status,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt
    }
    const inventory = await this.inventoryRepository.save(createInv)

    return inventory ? createInv.id : ''
  }

  async updateInventory(id: string, dto: UpdateInventoryDTO): Promise<boolean> {
    try {
      dto.validate()
    } catch (error: any) {
      throw new Error(error.message)
    }

    const inventory = await this.inventoryRepository.findById(id)

    if (!inventory) {
      throw new Error('Inventory not found!')
    }

    const updateInventory = {
      ...inventory,
      productId: dto.productId || inventory.productId,
      quantity: dto.quantity ? dto.quantity + inventory.quantity : inventory.quantity,
      costPrice: dto.costPrice || inventory.costPrice,
      status: dto.status || inventory.status,
      updatedAt: dto.updatedAt || inventory.updatedAt
    }

    const result = await this.inventoryRepository.update(id, updateInventory)
    return result ? true : false
  }

  async listAllInventory(
    condition: InventorySearchDTO,
    paging: Paging
  ): Promise<{ inventories: Inventory[]; total_pages: number }> {
    return await this.inventoryRepository.list_paginate(condition, paging)
  }

  async checkInventory(dto: InventoryCheckDTO[]): Promise<boolean | void> {
    const inventories = await this.inventoryRepository.list_all(dto.map((cart) => cart.productId))

    const inventoryMap = new Map()
    const invCheck: { productId: string; message: string }[] = []

    if (inventories) {
      for (const item of inventories) {
        inventoryMap.set(item.productId, { quantity: item.quantity, status: item.status })
      }
    }

    for (const item of dto) {
      const productInfo = inventoryMap.get(item.productId) || { quantity: 0, status: BaseStatus.OUTOFSTOCK }

      if (item.quantity > productInfo.quantity) {
        const quantityMissing = item.quantity - productInfo.quantity
        invCheck.push({
          productId: item.productId,
          message: `Product quantity is missing: ${quantityMissing}`
        })
      } else if (productInfo.status === BaseStatus.OUTOFSTOCK) {
        invCheck.push({ productId: item.productId, message: `Product is ${productInfo.status}` })
      }
    }

    if (invCheck.length > 0) {
      throw new Error(
        `Prouct(s) is not enough: ${invCheck.map((inv) => `id: ${inv.productId} - ${inv.message}`).join(', ')}`
      )
    }
  }
}
