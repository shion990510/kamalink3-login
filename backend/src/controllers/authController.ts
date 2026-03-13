import { Request, Response } from 'express'
import { auth, db } from '../config/firebase.js'
import { generateToken } from '../config/jwt.js'

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'メールアドレスとパスワードが必要です' })
    }

    // Firebase Authenticationで認証
    try {
      const user = await auth.getUserByEmail(email)
      
      // Firestoreからユーザー情報を取得
      const userDoc = await db.collection('users').doc(user.uid).get()
      
      if (!userDoc.exists) {
        return res.status(401).json({ message: 'ユーザーが見つかりません' })
      }

      const userData = userDoc.data()

      // ステータスがアクティブでない場合は拒否
      if (userData?.status !== 'active') {
        return res.status(401).json({ message: 'このアカウントはまだ承認されていません' })
      }

      // JWTトークンを生成
      const token = generateToken(user.uid, email, userData?.role || 'collector')

      return res.json({
        success: true,
        token,
        user: {
          id: user.uid,
          email: user.email,
          name: userData?.name || email,
          role: userData?.role || 'collector',
          createdAt: userData?.createdAt,
        },
      })
    } catch (error: any) {
      // Firebase認証エラー
      return res.status(401).json({ message: 'メールアドレスまたはパスワードが間違っています' })
    }
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ message: 'サーバーエラーが発生しました' })
  }
}

export const signup = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, name, email, password } = req.body

    // バリデーション
    if (!phoneNumber || !name || !email || !password) {
      return res.status(400).json({ message: 'すべてのフィールドが必要です' })
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'パスワードは8文字以上で設定してください' })
    }

    // メールアドレスが既に登録されているか確認
    try {
      await auth.getUserByEmail(email)
      return res.status(400).json({ message: 'このメールアドレスは既に登録されています' })
    } catch (error: any) {
      if (error.code !== 'auth/user-not-found') {
        throw error
      }
    }

    // Firebase Authenticationで新規ユーザーを作成
    const userRecord = await auth.createUser({
      email,
      password,
    })

    // pending_registrations に記録
    await db.collection('pending_registrations').doc(email).set({
      email,
      phoneNumber,
      name,
      requestedAt: new Date().toISOString(),
      status: 'pending',
    })

    // users コレクションに pending ステータスで追加
    await db.collection('users').doc(userRecord.uid).set({
      email,
      name,
      phoneNumber,
      role: 'collector',
      status: 'pending',
      createdAt: new Date().toISOString(),
    })

    return res.json({
      success: true,
      message: '新規登録申請が完了しました。管理者の承認をお待ちください。',
    })
  } catch (error: any) {
    console.error('Signup error:', error)
    return res.status(500).json({ message: 'サーバーエラーが発生しました' })
  }
}
