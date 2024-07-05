import { v4 as uuidv4 } from 'uuid'

import { Category, CategoryListingConditionDTO } from '../model/category'
import type { ICategoryRepository } from '../interfaces/repository'
import type { ICategoryUseCase } from '../interfaces/usecase'
import type { CreateCategoryDTO } from '../infras/transport/dto/category_creation'
import { BaseStatus } from '../../../shared/dto/status'
import type { UpdateCategoryDTO } from '../infras/transport/dto/category_update'
import { ErrCategoryExists, ErrCategoryInActive } from '../model/category.error'
import type { CategoryDetailDTO } from '../infras/transport/dto/category_detail'
import type { Paging } from '../../../shared/dto/paging'

export class CategoryUseCase implements ICategoryUseCase {
  constructor(readonly categoryRepository: ICategoryRepository) {}

  async createCategory(dto: CreateCategoryDTO): Promise<boolean> {
    try {
      dto.validate()
    } catch (error: any) {
      throw new Error(error.message)
    }

    const name = await this.categoryRepository.findByName(dto.name)

    if (name) {
      throw ErrCategoryExists
    }

    const categoryId = uuidv4()

    const newCategory = new Category(categoryId, dto.name, dto.description, BaseStatus.ACTIVE, dto.parentId)

    await this.categoryRepository.insertCategory(newCategory)

    return true
  }

  async updateCategory(id: string, dto: UpdateCategoryDTO): Promise<boolean> {
    try {
      dto.validate()
    } catch (error: any) {
      throw new Error(error.message)
    }

    //check Category name
    const category = await this.categoryRepository.findById(id)

    if (!category) {
      throw ErrCategoryExists
    }

    const updatedCategory = {
      ...category,
      name: dto.name ?? category.name,
      description: dto.description ?? category.description,
      status: dto.status ?? category.status,
      parentId: dto.parentId ?? category.parentId
    }

    await this.categoryRepository.updateCategoryById(id, updatedCategory)

    return true
  }

  async deleteCategory(id: string): Promise<boolean> {
    const category = await this.categoryRepository.findById(id)

    if (!category) {
      throw ErrCategoryExists
    }

    if (category.status === BaseStatus.INACTIVE) {
      throw ErrCategoryInActive
    }

    await this.categoryRepository.deleteCategoryById(id)

    return true
  }

  async listingCategory(
    condition: CategoryListingConditionDTO,
    paging: Paging
  ): Promise<{ categorys: Category[]; total_pages: number }> {
    return await this.categoryRepository.listingCategory(condition, paging)
  }

  async detailCategory(id: string): Promise<CategoryDetailDTO | null> {
    return await this.categoryRepository.findCategoryById(id)
  }
}
