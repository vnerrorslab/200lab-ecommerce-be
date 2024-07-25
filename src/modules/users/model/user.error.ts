// domain errors: loi nghiep vu
const ErrUserExists = new Error('User already exists')
const ErrUserNotFound = new Error('User not found')
const ErrEmailExists = new Error('Email already exists')
const ErrUserInActive = new Error('User is inactive')

//cả hai thiếu thì nghiệp vụ

export { ErrUserExists, ErrUserNotFound, ErrEmailExists, ErrUserInActive }
