import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ALDSS backend running', timestamp: new Date() })
})

// Routes will be added here as we build them
// app.use('/api/auth', authRoutes)
// app.use('/api/sessions', sessionRoutes)
// app.use('/api/events', eventRoutes)

app.listen(PORT, () => {
  console.log(`ALDSS server running on port ${PORT}`)
})

export default app