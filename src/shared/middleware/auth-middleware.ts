import type { Request, Response, NextFunction } from 'express'
import { IAuthUseCase } from '~/modules/auth/interfaces/usecase'

export function authMiddleware(authUseCase: IAuthUseCase) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(' ')[1]
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const { userId, role, actions } = await authUseCase.middlewareCheck(token)

      req.user = { userId, role, actions }

      next()
    } catch (error) {
      res.status(401).json({ error: 'Unauthorized' })
    }
  }
}
