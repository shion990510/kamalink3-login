import express from 'express'
import { authMiddleware } from '../middleware/auth'
import { getMessages, postMessage } from '../controllers/messageController'

const router = express.Router()

router.get('/', authMiddleware, getMessages)
router.post('/', authMiddleware, postMessage)

export default router
