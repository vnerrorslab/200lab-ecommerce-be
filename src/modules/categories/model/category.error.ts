// domain errors: loi nghiep vu
const ErrCategoryExists = new Error('Category already exists')
const ErrCategoryNotFound = new Error('Category not found')
const ErrCategoryInActive = new Error('Category is inactive')

export { ErrCategoryExists, ErrCategoryNotFound, ErrCategoryInActive }
