// domain errors: loi nghiep vu

const ErrBrandExists = new Error('Brand already exists')
const ErrBrandNotFound = new Error('Brand not found')
const ErrBrandInActive = new Error('Brand is inactive')

export { ErrBrandExists, ErrBrandNotFound, ErrBrandInActive }
