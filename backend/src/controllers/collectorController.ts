import { Request, Response } from 'express'
import { auth, db } from '../config/firebase.js'
import { AuthRequest } from '../middleware/auth.js'

export const getCollectors = async (req: AuthRequest, res: Response) => {
  try {
    // 承認済みコレクターを取得
    const collectorsSnapshot = await db
      .collection('users')
      .where('status', '==', 'active')
      .where('role', '==', 'collector')
      .get()

    const collectors = collectorsSnapshot.docs.map(doc => ({
      email: doc.data().email,
      name: doc.data().name,
      status: doc.data().status,
      createdAt: doc.data().createdAt,
    }))

    // 保留中のコレクターを取得
    const pendingSnapshot = await db
      .collection('pending_registrations')
      .where('status', '==', 'pending')
      .get()

    const pending = pendingSnapshot.docs.map(doc => ({
      email: doc.data().email,
      requestedAt: doc.data().requestedAt,
    }))

    return res.json({
      collectors,
      pending,
    })
  } catch (error) {
    console.error('Get collectors error:', error)
    return res.status(500).json({ message: 'コレクター情報の取得に失敗しました' })
  }
}

export const approvePendingCollector = async (req: AuthRequest, res: Response) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: 'メールアドレスが必要です' })
    }

    // 保留中のリクエストを確認
    const pendingDoc = await db
      .collection('pending_registrations')
      .doc(email)
      .get()

    if (!pendingDoc.exists) {
      return res.status(404).json({ message: 'リクエストが見つかりません' })
    }

    // ユーザーを有効化
    try {
      const user = await auth.getUserByEmail(email)
      
      // ユーザーをアクティブに設定
      await db.collection('users').doc(user.uid).update({
        status: 'active',
        approvedAt: new Date().toISOString(),
        approvedBy: req.user.email,
      })

      // 保留中の登録を削除
      await db.collection('pending_registrations').doc(email).delete()

      return res.json({
        success: true,
        message: 'コレクターを承認しました',
      })
    } catch (error: any) {
      return res.status(500).json({ message: 'ユーザーの承認に失敗しました' })
    }
  } catch (error) {
    console.error('Approve collector error:', error)
    return res.status(500).json({ message: 'サーバーエラーが発生しました' })
  }
}

export const rejectPendingCollector = async (req: AuthRequest, res: Response) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: 'メールアドレスが必要です' })
    }

    // 保留中のリクエストを確認
    const pendingDoc = await db
      .collection('pending_registrations')
      .doc(email)
      .get()

    if (!pendingDoc.exists) {
      return res.status(404).json({ message: 'リクエストが見つかりません' })
    }

    // ユーザーを削除
    try {
      const user = await auth.getUserByEmail(email)
      
      // ユーザーを削除
      await auth.deleteUser(user.uid)
      
      // Firestoreのユーザードキュメントを削除
      await db.collection('users').doc(user.uid).delete()

      // 保留中の登録を削除
      await db.collection('pending_registrations').doc(email).delete()

      return res.json({
        success: true,
        message: 'リクエストを却下しました',
      })
    } catch (error: any) {
      return res.status(500).json({ message: 'リクエストの却下に失敗しました' })
    }
  } catch (error) {
    console.error('Reject collector error:', error)
    return res.status(500).json({ message: 'サーバーエラーが発生しました' })
  }
}
