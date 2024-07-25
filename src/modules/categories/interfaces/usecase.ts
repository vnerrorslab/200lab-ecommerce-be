import type { Paging } from '../../../shared/dto/paging'
import type { CreateCategoryDTO } from '../infras/transport/dto/category_creation'
import type { CategoryDetailDTO } from '../infras/transport/dto/category_detail'
import type { UpdateCategoryDTO } from '../infras/transport/dto/category_update'
import type { CategoryListingConditionDTO } from '../model/category'

//nghiep vu
export interface ICategoryUseCase {
  createCategory(dto: CreateCategoryDTO): Promise<boolean>

  updateCategory(id: string, dto: UpdateCategoryDTO): Promise<boolean>

  deleteCategory(id: string): Promise<boolean>

  listingCategory(condition: CategoryListingConditionDTO, paging: Paging): Promise<any>

  detailCategory(id: string): Promise<CategoryDetailDTO | null>
}
