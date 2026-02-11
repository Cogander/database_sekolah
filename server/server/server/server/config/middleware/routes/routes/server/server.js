require('dotenv').config()
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const rateLimit = require('express-rate-limit')

const authRoutes = require('./routes/authRoutes')
const statsRoutes = require('./routes/statsRoutes')

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
})
app.use(limiter)

app.use("/api/auth", authRoutes)
app.use("/api/stats", statsRoutes)

app.listen(process.env.PORT, () =>
  console.log("🚀 Server running on port " + process.env.PORT)
)
