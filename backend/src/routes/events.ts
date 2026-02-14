import { Router, Request, Response } from 'express'
import { authMiddleware } from '../middleware/auth'
import {
  createEvent,
  getEvents,
  respondToEvent,
  getUserEventStatus,
  deleteEvent,
  setDateAvailability,
  getUserDateAvailability,
  getAllDateAvailability,
} from '../controllers/eventController'

const router = Router()

// 日付の参加可能状況を設定（認証必要）- より具体的なパターンを先に定義
router.post('/availability/set', authMiddleware, setDateAvailability)

// ユーザーの日付参加可能状況取得（認証必要）
router.get('/availability/user', authMiddleware, getUserDateAvailability)

// 全コレクターの日付参加可能状況取得（認証不要）
router.get('/availability/all', getAllDateAvailability)

// ユーザーのイベント参加状態取得（認証必要）
router.get('/user/status', authMiddleware, getUserEventStatus)

// イベント一覧取得（認証不要）
router.get('/', getEvents)

// イベント作成（認証必要）
router.post('/', authMiddleware, createEvent)

// イベントに応答（認証必要）
router.post('/:eventId/respond', authMiddleware, respondToEvent)

// イベント削除（認証必要）
router.delete('/:eventId', authMiddleware, deleteEvent)

export default router
