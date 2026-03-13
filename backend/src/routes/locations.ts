import express from 'express'
import { authMiddleware } from '../middleware/auth.js'
import { updateLocation, getActiveLocations, stopSharing } from '../controllers/locationController.js'

const router = express.Router()

// 認証が必要なルート
router.post('/update', authMiddleware, updateLocation)
router.post('/stop', authMiddleware, stopSharing)

// 認証不要（一般ユーザー向け）
router.get('/active', getActiveLocations)

export default router
