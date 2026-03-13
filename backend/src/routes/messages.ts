import express from 'express'
import { authMiddleware } from '../middleware/auth.js'
import { getMessages, postMessage } from '../controllers/messageController.js'

const router = express.Router()

router.get('/', authMiddleware, getMessages)
router.post('/', authMiddleware, postMessage)

export default router
