import { Request, Response } from 'express'
import { db } from '../config/firebase'
import { AuthRequest } from '../middleware/auth'

export const updateLocation = async (req: AuthRequest, res: Response) => {
  try {
    const { latitude, longitude, accuracy } = req.body
    const userId = req.user.userId
    const email = req.user.email

    if (!latitude || !longitude) {
      return res.status(400).json({ message: '緯度と経度が必要です' })
    }

    // Firestore に位置情報を保存
    await db.collection('locations').doc(userId).set({
      userId,
      email,
      latitude,
      longitude,
      accuracy,
      isSharing: true,
      updatedAt: new Date().toISOString(),
    })

    return res.json({
      success: true,
      message: '位置情報を更新しました',
    })
  } catch (error: any) {
    console.error('Update location error:', error)
    return res.status(500).json({ message: 'サーバーエラーが発生しました' })
  }
}

export const getActiveLocations = async (req: Request, res: Response) => {
  try {
    // 5分以内に更新された位置情報を取得（シンプルなクエリ）
    const snapshot = await db
      .collection('locations')
      .where('isSharing', '==', true)
      .get()

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
    
    const collectors = snapshot.docs
      .filter(doc => {
        const updatedAt = doc.data().updatedAt
        if (!updatedAt) return false
        return new Date(updatedAt) > fiveMinutesAgo
      })
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))

    return res.json({
      success: true,
      collectors,
    })
  } catch (error: any) {
    console.error('Get locations error:', error)
    return res.status(500).json({ message: 'サーバーエラーが発生しました' })
  }
}

export const stopSharing = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.userId

    // 共有を停止
    await db.collection('locations').doc(userId).update({
      isSharing: false,
      stoppedAt: new Date().toISOString(),
    })

    return res.json({
      success: true,
      message: '位置情報の共有を停止しました',
    })
  } catch (error: any) {
    console.error('Stop sharing error:', error)
    return res.status(500).json({ message: 'サーバーエラーが発生しました' })
  }
}
