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

export const getMessages = async (req: Request, res: Response) => {
  try {
    const snapshot = await db
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .limit(100)
      .get()

    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
    }))

    return res.json({
      success: true,
      messages: messages.reverse(), // 古い順に表示
    })
  } catch (error: any) {
    console.error('Get messages error:', error)
    return res.status(500).json({ message: 'メッセージの取得に失敗しました' })
  }
}

export const postMessage = async (req: Request, res: Response) => {
  try {
    console.log('postMessage called, body:', req.body)
    console.log('user:', req.user)
    
    const { content } = req.body

    if (!content || !content.trim()) {
      console.log('No content provided')
      return res.status(400).json({ message: 'メッセージの内容を入力してください' })
    }

    // uid または userId を確認
    const userId = req.user?.uid || req.user?.userId
    if (!userId) {
      console.log('No user ID found in token')
      return res.status(401).json({ message: '認証が必要です' })
    }

    console.log('User ID:', userId)
    
    // ユーザー情報を取得
    const userDoc = await db.collection('users').doc(userId).get()
    const userData = userDoc.data()
    console.log('User data:', userData)

    const messageRef = db.collection('messages').doc()
    await messageRef.set({
      content: content.trim(),
      authorId: userId,
      authorName: userData?.name || req.user?.email || 'Anonymous',
      createdAt: new Date(),
    })

    console.log('Message saved with ID:', messageRef.id)
    return res.json({
      success: true,
      messageId: messageRef.id,
      message: 'メッセージを投稿しました',
    })
  } catch (error: any) {
    console.error('Post message error:', error)
    console.error('Error details:', error.message, error.code)
    return res.status(500).json({ message: 'メッセージの投稿に失敗しました', error: error.message })
  }
}
