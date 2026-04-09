import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes'
import eventRoutes from './routes/event.routes'
import surveyRoutes from './routes/survey.routes'
import contentRoutes from './routes/content.routes'
import adminRoutes from './routes/admin.routes'
import aiRoutes from './routes/ai.routes'





dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'ALDSS backend running', timestamp: new Date() })
})

app.use('/api/auth', authRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/surveys', surveyRoutes)
app.use('/api/content', contentRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/ai', aiRoutes)





app.listen(PORT, () => {
  console.log(`ALDSS server running on port ${PORT}`)
})

export default app