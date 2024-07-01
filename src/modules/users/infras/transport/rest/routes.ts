import { Router, type Request, type Response } from 'express'
import { CreateUserDTO } from '../dto/user_creation'
import { User, UserListingConditionDTO } from '../../../model/user'
import { Paging } from '../../../../../shared/dto/paging'
import type { IUserUseCase } from '../../../interfaces/usecase'
import { UpdateUserDTO } from '../dto/user_update'
import { Image } from '../../../model/image'

export class UserService {
  constructor(readonly userUseCase: IUserUseCase) {}

  async insert_user(req: Request, res: Response) {
    try {
      const { first_name, last_name, email, password, phone, address, identification_card, image_id } = req.body
      const userDTO = new CreateUserDTO(
        first_name,
        last_name,
        email,
        password,
        phone,
        address,
        identification_card,
        image_id
      )

      const user = await this.userUseCase.createUser(userDTO)

      res.status(201).send({ code: 201, message: 'insert user successful', data: user })
    } catch (error: any) {
      res.status(400).send({ error: error.message })
    }
  }

  async list_users(req: Request, res: Response) {
    try {
      const { searchStr } = req.query
      const condition = new UserListingConditionDTO(searchStr as string)

      //phân trang nè
      const limit = parseInt(req.query.limit as string) || 10
      const page = parseInt(req.query.page as string) || 1

      const paging: Paging = new Paging(page, 0, limit)

      const { users, total_pages } = await this.userUseCase.listUsers(condition, paging)

      if (users.length > 0) {
        users.forEach((user: User) => {
          if (user.image) {
            const image = new Image(
              user.image.id,
              user.image.path,
              user.image.cloud_name,
              user.image.width,
              user.image.height,
              user.image.size
            )
            image.fillUrl(process.env.URL_PUBLIC || '')
            user.image = image
          }
        })
      }

      const total = Math.ceil(total_pages / limit)

      return res.status(200).json({ code: 200, message: 'list users', data: users, total_pages: total })
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  }

  async update_user(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { first_name, last_name, email, password, phone, address, identification_card, status } = req.body

      const userDTO = new UpdateUserDTO(
        first_name,
        last_name,
        email,
        password,
        phone,
        address,
        identification_card,
        status
      )

      const user = await this.userUseCase.updateUser(id, userDTO)

      return res.status(200).send({ code: 200, message: 'update user successful', data: user })
    } catch (error: any) {
      return res.status(400).send({ error: error.message })
    }
  }

  async delete_user(req: Request, res: Response) {
    try {
      const { id } = req.params

      await this.userUseCase.deleteUser(id)

      return res.status(200).send({ code: 200, message: 'delete user successful' })
    } catch (error: any) {
      return res.status(400).send({ error: error.message })
    }
  }

  async user_detail(req: Request, res: Response) {
    try {
      const { id } = req.params

      const user = await this.userUseCase.getUserDetail(id)

      if (!user) {
        return res.status(404).send({ code: 404, message: 'user not found' })
      }

      if (user.image) {
        const image = new Image(
          user.image.id,
          user.image.path,
          user.image.cloud_name,
          user.image.width,
          user.image.height,
          user.image.size
        )
        image.fillUrl(process.env.URL_PUBLIC || '')
        user.image = image
      }

      return res.status(200).send({ code: 200, message: 'user information', data: user })
    } catch (error: any) {
      return res.status(400).send({ error: error.message })
    }
  }

  setupRoutes(): Router {
    const router = Router()

    router.get('/users', this.list_users.bind(this))

    router.post('/users', this.insert_user.bind(this))

    router.put('/users/:id', this.update_user.bind(this))

    router.delete('/users/:id', this.delete_user.bind(this))

    router.get('/users/:id', this.user_detail.bind(this))

    return router
  }
}
