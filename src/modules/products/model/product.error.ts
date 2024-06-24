// domain errors: loi nghiep vu
let ErrProductExists = new Error('Product already exists')
let ErrProductNotFound = new Error('Product not found')
let ErrProductInActive = new Error('Product is inactive')
//cả hai thiếu thì nghiệp vụ

export { ErrProductExists, ErrProductNotFound, ErrProductInActive }
