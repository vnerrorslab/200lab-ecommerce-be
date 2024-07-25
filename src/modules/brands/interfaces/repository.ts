import { Paging } from '~/shared/dto/paging'
import type { BrandDetailDTO } from '../infras/transport/dto/brand_detail'
import type { Brand, BrandListingConditionDTO, BrandUpdateDTO } from '../model/brand'
import { Image } from '../model/image'

// xu ly nghiep vu - duoi database
export interface IBrandRepository {
  insertBrand(data: Brand): Promise<string>

  findById(id: string): Promise<Brand | null>

  findByName(name: string): Promise<Brand | null>

  listingBrand(condition: BrandListingConditionDTO, paging: Paging): Promise<{ brands: Brand[]; total_pages: number }>

  updateBrandById(id: string, data: BrandUpdateDTO): Promise<boolean>

  deleteBrandById(id: string): Promise<boolean>

  findBrandById(id: string): Promise<BrandDetailDTO | null>
}

export interface IImageRepository {
  findById(id: string): Promise<Image | null>
}
