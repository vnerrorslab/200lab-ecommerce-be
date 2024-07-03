import { v4 as uuidv4 } from 'uuid'

import { BasePaging, Paging } from '~/shared/dto/paging'
import { BaseStatus } from '~/shared/dto/status'
import { USING_IMAGE, sharedEventEmitter } from '~/shared/utils/event-emitter'
import type { CreateProductDTO } from '../infras/transport/dto/product_creation'
import type { UpdateProductDTO } from '../infras/transport/dto/product_update'
import type {
  IBrandRepository,
  ICategoryRepository,
  IImageRepository,
  IProductRepository
} from '../interfaces/repository'
import type { IProductUseCase } from '../interfaces/usecase'
import { Brand } from '../model/brand'
import { Category } from '../model/category'
import { Image } from '../model/image'
import { Product, ProductDetail, ProductListingConditionDTO } from '../model/product'
import { ErrProductExists, ErrProductInActive } from '../model/product.error'

export class ProductUseCase implements IProductUseCase {
  constructor(
    readonly productRepository: IProductRepository,
    readonly imageRepository: IImageRepository,
    readonly brandRepository: IBrandRepository,
    readonly categoryRepository: ICategoryRepository
  ) {}

  async createProduct(dto: CreateProductDTO): Promise<boolean> {
    try {
      dto.validate()
    } catch (error: any) {
      throw new Error(error.message)
    }

    const name = await this.productRepository.findByName(dto.name)

    if (name) {
      throw ErrProductExists
    }

    const productId = uuidv4()

    const images = await this.imageRepository.findByIds(dto.images)

    const newProduct = new Product(
      productId,
      dto.name,
      images,
      dto.price,
      dto.quantity,
      dto.brand_id,
      dto.category_id,
      dto.description,
      BaseStatus.ACTIVE,
      dto.created_by,
      dto.updated_by
    )

    await this.productRepository.insertProduct(newProduct)

    if (images.length > 0) {
      images.forEach(async (image: Image) => {
        sharedEventEmitter.emit(USING_IMAGE, { image_id: image.id })
      })
    }

    return true
  }

  async updateProduct(id: string, dto: UpdateProductDTO): Promise<boolean> {
    try {
      dto.validate()
    } catch (error: any) {
      throw new Error(error.message)
    }

    //check product name
    const product = await this.productRepository.findById(id)

    if (!product) {
      throw ErrProductExists
    }

    const updatedProduct = {
      ...product,
      name: dto.name ?? product.name,
      images: dto.images ?? product.images,
      price: dto.price ?? product.price,
      quantity: dto.quantity ?? product.quantity,
      brand_id: dto.brand_id ?? product.brand_id,
      category_id: dto.category_id ?? product.category_id,
      description: dto.description ?? product.description,
      status: dto.status ?? product.status,
      updated_by: dto.updated_by ?? product.updated_by
    }

    await this.productRepository.updateProductById(id, updatedProduct)

    return true
  }

  async deleteProduct(id: string): Promise<boolean> {
    const product = await this.productRepository.findById(id)

    if (!product) {
      throw ErrProductExists
    }

    if (product.status === BaseStatus.INACTIVE) {
      throw ErrProductInActive
    }

    await this.productRepository.deleteProductById(id)

    return true
  }

  async listingProduct(condition: ProductListingConditionDTO, paging: Paging): Promise<BasePaging<ProductDetail[]>> {
    const listProducts = await this.productRepository.listingProduct(condition, paging)
    const brandId = new Set(listProducts.products.map((product) => product.brand_id))
    const categoryId = new Set(listProducts.products.map((product) => product.category_id))

    const categoryMap = new Map<string, Category>()
    if (categoryId.size !== 0) {
      const categories = await this.categoryRepository.findByIds(Array.from(categoryId))
      categories.forEach((category) => categoryMap.set(category.id, category))
    }

    const brandMap = new Map<string, Brand>()
    if (brandId.size !== 0) {
      const brands = await this.brandRepository.findByIds(Array.from(brandId))
      brands.forEach((brand: Brand) => {
        if (brand.image) {
          const image = new Image(
            brand.image.id,
            brand.image.path,
            brand.image.cloud_name,
            brand.image.width,
            brand.image.height,
            brand.image.size
          )
          image.fillUrl(process.env.URL_PUBLIC || '')
          brand.image.url = image.url
        }
      })

      brands.forEach((brand) => brandMap.set(brand.id, brand))
    }

    const listProductDetail = listProducts.products.map((product) => {
      return new ProductDetail(
        product.id,
        product.name,
        product.images,
        product.price,
        product.quantity,
        brandMap.get(product.brand_id) ?? null,
        categoryMap.get(product.category_id) ?? null,
        product.description,
        product.status,
        product.created_by,
        product.updated_by
      )
    })

    return { data: listProductDetail, total_pages: listProducts.total_pages }
  }

  async detailProduct(id: string): Promise<ProductDetail | null> {
    const product = await this.productRepository.findProductById(id)

    if (!product) {
      return null
    }

    const brand = await this.brandRepository.findById(product?.brand_id ?? '')

    if (brand?.image) {
      const image = new Image(
        brand.image.id,
        brand.image.path,
        brand.image.cloud_name,
        brand.image.width,
        brand.image.height,
        brand.image.size
      )
      image.fillUrl(process.env.URL_PUBLIC || '')
      brand.image.url = image.url
    }

    const category = await this.categoryRepository.findById(product?.category_id ?? '')

    return { ...product, brand: brand, category: category }
  }
}
