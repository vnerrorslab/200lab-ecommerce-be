// domain errors: loi nghiep vu
const ErrProductExists = new Error('Product already exists')
const ErrProductNotFound = new Error('Product not found')
const ErrProductInActive = new Error('Product is inactive')
//cả hai thiếu thì nghiệp vụ

export { ErrProductExists, ErrProductNotFound, ErrProductInActive }
