import { Paging } from '~/shared/dto/paging'
import type { CreateBrandDTO } from '../infras/transport/dto/brand_creation'
import type { BrandDetailDTO } from '../infras/transport/dto/brand_detail'
import type { UpdateBrandDTO } from '../infras/transport/dto/brand_update'
import { BrandListingConditionDTO } from '../model/brand'

//nghiep vu
export interface IBrandUseCase {
  createBrand(dto: CreateBrandDTO): Promise<boolean>

  updateBrand(id: string, dto: UpdateBrandDTO): Promise<boolean>

  deleteBrand(id: string): Promise<boolean>

  listingBrand(condition: BrandListingConditionDTO, paging: Paging): Promise<any>

  detailBrand(id: string): Promise<BrandDetailDTO | null>
}
