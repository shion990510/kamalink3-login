import { Request, Response } from 'express'
import { db } from '../config/firebase.js'
import { DecodedIdToken } from 'firebase-admin/auth'

declare global {
  namespace Express {
    interface Request {
      user?: DecodedIdToken
    }
  }
}

export const createEvent = async (req: Request, res: Response) => {
  try {
    const { eventName, eventDate, eventTime } = req.body

    if (!eventName || !eventDate || !eventTime) {
      return res.status(400).json({ message: 'イベント名・開催日程・予定時間を指定してください' })
    }

    const eventRef = db.collection('events').doc()
    await eventRef.set({
      eventName,
      eventDate: new Date(eventDate),
      eventTime,
      createdAt: new Date(),
      participants: {},
    })

    return res.json({
      success: true,
      eventId: eventRef.id,
      message: 'イベントを作成しました',
    })
  } catch (error: any) {
    console.error('Create event error:', error)
    return res.status(500).json({ message: 'サーバーエラーが発生しました' })
  }
}

export const getEvents = async (req: Request, res: Response) => {
  try {
    const snapshot = await db.collection('events').orderBy('eventDate', 'asc').get()

    const events = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      eventDate: doc.data().eventDate?.toDate?.() || doc.data().eventDate,
      participants: doc.data().participants || {},
    }))

    const userIds = new Set<string>()
    events.forEach(event => {
      Object.keys(event.participants || {}).forEach(userId => userIds.add(userId))
    })

    const userEntries = await Promise.all(
      Array.from(userIds).map(async userId => {
        const userDoc = await db.collection('users').doc(userId).get()
        const userData = userDoc.data()
        const name = userData?.name || userData?.email || userId
        return [userId, name] as const
      })
    )

    const userNameById = Object.fromEntries(userEntries)

    // 参加者数を計算
    const eventsWithCounts = events.map(event => {
      const participantsList = Object.entries(event.participants || {})
      const approvedCount = participantsList.filter(([, status]) => status === 'approved').length
      const pendingCount = participantsList.filter(([, status]) => status === 'pending').length
      const rejectedCount = participantsList.filter(([, status]) => status === 'rejected').length

      const participantDetails = {
        approved: participantsList
          .filter(([, status]) => status === 'approved')
          .map(([userId]) => userNameById[userId] || userId),
        pending: participantsList
          .filter(([, status]) => status === 'pending')
          .map(([userId]) => userNameById[userId] || userId),
        rejected: participantsList
          .filter(([, status]) => status === 'rejected')
          .map(([userId]) => userNameById[userId] || userId),
      }

      return {
        ...event,
        approvedCount,
        pendingCount,
        rejectedCount,
        totalCount: participantsList.length,
        isConfirmed: approvedCount >= 3,
        participantDetails,
      }
    })

    return res.json({
      success: true,
      events: eventsWithCounts,
    })
  } catch (error: any) {
    console.error('Get events error:', error)
    return res.status(500).json({ message: 'サーバーエラーが発生しました' })
  }
}
export const getAllDateAvailability = async (req: Request, res: Response) => {
  try {
    // 全コレクターの日付参加状況を取得
    const querySnapshot = await db.collection('user_availability').get()

    const dateStats: Record<string, { approved: number; rejected: number; pending: number }> = {}

    querySnapshot.forEach(doc => {
      const data = doc.data()
      const date = data.date
      const status = data.status

      if (!dateStats[date]) {
        dateStats[date] = { approved: 0, rejected: 0, pending: 0 }
      }

      if (status === 'approved') {
        dateStats[date].approved++
      } else if (status === 'rejected') {
        dateStats[date].rejected++
      } else if (status === 'pending') {
        dateStats[date].pending++
      }
    })

    return res.json({
      success: true,
      dateStats
    })
  } catch (error: any) {
    console.error('Get all availability error:', error)
    return res.status(500).json({ message: 'サーバーエラーが発生しました' })
  }
}
export const respondToEvent = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params
    const { status } = req.body
    const userId = req.user?.userId

    if (!userId) {
      return res.status(401).json({ message: '認証が必要です' })
    }

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ message: '無効なステータスです' })
    }

    const eventRef = db.collection('events').doc(eventId)
    await eventRef.update({
      [`participants.${userId}`]: status,
    })

    return res.json({
      success: true,
      message: '参加状態を更新しました',
    })
  } catch (error: any) {
    console.error('Respond to event error:', error)
    return res.status(500).json({ message: 'サーバーエラーが発生しました' })
  }
}

export const getUserEventStatus = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId

    if (!userId) {
      return res.status(401).json({ message: '認証が必要です' })
    }

    const snapshot = await db.collection('events').get()

    const userStatus: Record<string, string> = {}
    snapshot.docs.forEach(doc => {
      const participants = doc.data().participants || {}
      if (participants[userId]) {
        userStatus[doc.id] = participants[userId]
      }
    })

    return res.json({
      success: true,
      userStatus,
    })
  } catch (error: any) {
    console.error('Get user status error:', error)
    return res.status(500).json({ message: 'サーバーエラーが発生しました' })
  }
}

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params
    const userId = req.user?.userId

    if (!userId) {
      return res.status(401).json({ message: '認証が必要です' })
    }

    await db.collection('events').doc(eventId).delete()

    return res.json({
      success: true,
      message: 'イベントを削除しました',
    })
  } catch (error: any) {
    console.error('Delete event error:', error)
    return res.status(500).json({ message: 'サーバーエラーが発生しました' })
  }
}
export const setDateAvailability = async (req: Request, res: Response) => {
  try {
    const { date, status } = req.body
    const userId = req.user?.userId

    console.log('setDateAvailability called:', { userId, date, status, user: req.user })

    if (!userId) {
      return res.status(401).json({ message: '認証が必要です', user: req.user })
    }

    if (!date || !status) {
      return res.status(400).json({ message: '日付とステータスは必須です' })
    }

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'ステータスが無効です' })
    }

    // user_availability コレクションに保存
    const docId = `${userId}_${date}`
    console.log('Saving to Firestore:', { docId, userId, date, status })

    await db.collection('user_availability').doc(docId).set({
      userId,
      date,
      status,
      updatedAt: new Date().toISOString()
    }, { merge: true })

    console.log('Successfully saved')

    return res.json({
      success: true,
      message: '参加可能状況を更新しました',
      data: { date, status }
    })
  } catch (error: any) {
    console.error('Set availability error:', error)
    return res.status(500).json({ 
      message: 'サーバーエラーが発生しました',
      error: error.message 
    })
  }
}

export const getUserDateAvailability = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId

    console.log('getUserDateAvailability called:', { userId, user: req.user })

    if (!userId) {
      return res.status(401).json({ message: '認証が必要です' })
    }

    // ユーザーの全ての日付参加可能状況を取得
    const querySnapshot = await db
      .collection('user_availability')
      .where('userId', '==', userId)
      .get()

    const availability: Record<string, string> = {}
    querySnapshot.forEach(doc => {
      const data = doc.data()
      availability[data.date] = data.status
    })

    return res.json({
      success: true,
      availability
    })
  } catch (error: any) {
    console.error('Get availability error:', error)
    return res.status(500).json({ message: 'サーバーエラーが発生しました' })
  }
}