import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.js'
import {
  setDateAvailability,
  getUserDateAvailability,
} from '../controllers/eventController.js'

const router = Router()

// ユーザーの日付参加可能状況を設定（認証必要）
router.post('/set', authMiddleware, setDateAvailability)

// ユーザーの日付参加可能状況取得（認証必要）
router.get('/user', authMiddleware, getUserDateAvailability)

export default router
