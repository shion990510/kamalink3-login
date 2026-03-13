import express from 'express'
import { authMiddleware, adminMiddleware } from '../middleware/auth.js'
import { getCollectors, approvePendingCollector, rejectPendingCollector } from '../controllers/collectorController.js'

const router = express.Router()

router.get('/', authMiddleware, getCollectors)
router.post('/approve', authMiddleware, adminMiddleware, approvePendingCollector)
router.post('/reject', authMiddleware, adminMiddleware, rejectPendingCollector)

export default router
