import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services/api'
import '../styles/SignupPage.css'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const validateForm = (): boolean => {
    if (!formData.phoneNumber || !formData.name || !formData.email || !formData.password) {
      setError('すべてのフィールドを入力してください')
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError('パスワードが一致しません')
      return false
    }

    if (formData.password.length < 8) {
      setError('パスワードは8文字以上で設定してください')
      return false
    }

    if (!formData.email.includes('@')) {
      setError('正しいメールアドレスを入力してください')
      return false
    }

    return true
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const result = await authService.signup({
        phoneNumber: formData.phoneNumber,
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })

      if (result.success) {
        setSuccess('登録申請が完了しました。管理者の承認をお待ちください。')
        setFormData({
          phoneNumber: '',
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
        })
        setTimeout(() => {
          navigate('/')
        }, 2000)
      }
    } catch (err: any) {
      setError(err.response?.data?.message || '登録に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h1>コレクター管理システム</h1>
        <p className="subtitle">新規登録</p>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label htmlFor="phoneNumber">電話番号</label>
            <input
              id="phoneNumber"
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="09012345678"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">名前</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="山田太郎"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">メールアドレス</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@example.com"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">パスワード</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="8文字以上で設定"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">パスワード（確認）</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="パスワードを再度入力"
              required
              disabled={isLoading}
            />
          </div>

          <button type="submit" className="signup-button" disabled={isLoading}>
            {isLoading ? '登録中...' : '新規登録'}
          </button>
        </form>

        <p className="login-link">
          既にアカウントをお持ちですか？ <Link to="/">ログインする</Link>
        </p>

        <p className="notice">
          ※ 新規登録には管理者の承認が必要です。<br />
          登録後、管理者からの承認メールをお待ちください。
        </p>
      </div>
    </div>
  )
}
