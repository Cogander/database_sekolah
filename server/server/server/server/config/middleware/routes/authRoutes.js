const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pool = require('../config/db')

const router = express.Router()

router.post("/login", async (req, res) => {
  const { username, password } = req.body

  const result = await pool.query(
    "SELECT * FROM users WHERE username=$1",
    [username]
  )

  if (result.rows.length === 0)
    return res.status(401).json({ message: "User not found" })

  const user = result.rows[0]
  const valid = await bcrypt.compare(password, user.password)

  if (!valid)
    return res.status(401).json({ message: "Wrong password" })

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  )

  res.json({ token })
})

module.exports = router
