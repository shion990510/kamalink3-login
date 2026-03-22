import admin from 'firebase-admin'
import dotenv from 'dotenv'

dotenv.config()

const normalizeEnvValue = (value?: string) => {
  if (!value) {
    return undefined
  }

  const trimmed = value.trim()
  const unquoted = trimmed.replace(/^['\"]|['\"]$/g, '')
  return unquoted
}

const normalizePrivateKey = (value?: string) => {
  const normalized = normalizeEnvValue(value)
  if (!normalized) {
    return undefined
  }

  return normalized.replace(/\\n/g, '\n')
}

const parseServiceAccountJson = () => {
  const raw = normalizeEnvValue(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    return {
      projectId: parsed.project_id as string,
      clientEmail: parsed.client_email as string,
      privateKey: parsed.private_key as string,
    }
  } catch (e) {
    console.error('FIREBASE_SERVICE_ACCOUNT_JSON のパースに失敗しました:', e)
    return null
  }
}

const fromJson = parseServiceAccountJson()

const serviceAccount = {
  projectId: fromJson?.projectId ?? normalizeEnvValue(process.env.FIREBASE_PROJECT_ID),
  clientEmail: fromJson?.clientEmail ?? normalizeEnvValue(process.env.FIREBASE_CLIENT_EMAIL),
  privateKey: fromJson?.privateKey ?? normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY),
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as any),
  })
}

export const auth = admin.auth()
export const db = admin.firestore()

export default admin
