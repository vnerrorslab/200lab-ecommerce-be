import { v4 as uuidv4 } from 'uuid'

import { Brand, BrandListingConditionDTO } from '../model/brand'
import type { IBrandRepository } from '../interfaces/repository'
import type { IBrandUseCase } from '../interfaces/usecase'
import type { CreateBrandDTO } from '../infras/transport/dto/brand_creation'
import { BaseStatus } from '~/shared/dto/status'
import type { UpdateBrandDTO } from '../infras/transport/dto/brand_update'
import { ErrBrandExists, ErrBrandInActive } from '../model/brand.error'
import type { BrandDetailDTO } from '../infras/transport/dto/brand_detail'
import { Paging } from '~/shared/dto/paging'

export class BrandUseCase implements IBrandUseCase {
  constructor(readonly brandRepository: IBrandRepository) {}

  async createBrand(dto: CreateBrandDTO): Promise<boolean> {
    try {
      dto.validate()
    } catch (error: any) {
      throw new Error(error.message)
    }

    const name = await this.brandRepository.findByName(dto.name)

    if (name) {
      throw ErrBrandExists
    }

    const brandId = uuidv4()

    const newBrand = new Brand(brandId, dto.name, dto.logo, dto.tag_line, dto.description, BaseStatus.ACTIVE)

    await this.brandRepository.insertBrand(newBrand)

    return true
  }

  async updateBrand(id: string, dto: UpdateBrandDTO): Promise<boolean> {
    try {
      dto.validate()
    } catch (error: any) {
      throw new Error(error.message)
    }

    //check brand name
    const brand = await this.brandRepository.findById(id)

    if (!brand) {
      throw ErrBrandExists
    }

    const updatedBrand = {
      ...brand,
      name: dto.name ?? brand.name,
      logo: dto.logo ?? brand.logo,
      tag_line: dto.tag_line ?? brand.tag_line,
      description: dto.description ?? brand.description,
      status: dto.status ?? brand.status
    }

    await this.brandRepository.updateBrandById(id, updatedBrand)

    return true
  }

  async deleteBrand(id: string): Promise<boolean> {
    const brand = await this.brandRepository.findById(id)

    if (!brand) {
      throw ErrBrandExists
    }

    if (brand.status === BaseStatus.INACTIVE) {
      throw ErrBrandInActive
    }

    await this.brandRepository.deleteBrandById(id)

    return true
  }

  async listingBrand(
    condition: BrandListingConditionDTO,
    paging: Paging
  ): Promise<{ brands: Brand[]; total_pages: number }> {
    return await this.brandRepository.listingBrand(condition, paging)
  }

  async detailBrand(id: string): Promise<BrandDetailDTO | null> {
    return await this.brandRepository.findBrandById(id)
  }
}