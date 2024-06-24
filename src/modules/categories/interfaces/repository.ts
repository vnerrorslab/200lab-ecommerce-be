import type { Paging } from '~/shared/dto/paging'
import type { CategoryDetailDTO } from '../infras/transport/dto/category_detail'
import type { Category, CategoryListingConditionDTO, CategoryUpdateDTO } from '../model/category'

// xu ly nghiep vu - duoi database
export interface ICategoryRepository {
  insertCategory(data: Category): Promise<string>

  findById(id: string): Promise<Category | null>

  findByName(name: string): Promise<Category | null>

  listingCategory(
    condition: CategoryListingConditionDTO,
    paging: Paging
  ): Promise<{ categorys: Category[]; total_pages: number }>

  updateCategoryById(id: string, data: CategoryUpdateDTO): Promise<boolean>

  deleteCategoryById(id: string): Promise<boolean>

  findCategoryById(id: string): Promise<CategoryDetailDTO | null>
}
