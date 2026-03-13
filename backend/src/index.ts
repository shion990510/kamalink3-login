import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import collectorRoutes from './routes/collectors.js'
import locationRoutes from './routes/locations.js'
import eventRoutes from './routes/events.js'
import messageRoutes from './routes/messages.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/collectors', collectorRoutes)
app.use('/api/locations', locationRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/messages', messageRoutes)

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' })
})

// Error handling
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Error:', err)
  res.status(500).json({ message: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
