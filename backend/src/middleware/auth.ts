import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../config/jwt.js'

export interface AuthRequest extends Request {
  user?: any
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'トークンが必要です' })
  }

  const decoded = verifyToken(token)
  if (!decoded) {
    return res.status(401).json({ message: '無効なトークンです' })
  }

  req.user = decoded
  next()
}

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: '管理者のみがこのアクションを実行できます' })
  }
  next()
}
