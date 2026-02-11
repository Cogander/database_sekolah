const express = require('express')
const pool = require('../config/db')
const verifyToken = require('../middleware/auth')

const router = express.Router()

router.get("/", verifyToken, async (req, res) => {
  const students = await pool.query("SELECT COUNT(*) FROM students")
  const teachers = await pool.query("SELECT COUNT(*) FROM teachers")
  const staff = await pool.query("SELECT COUNT(*) FROM staff")

  res.json({
    total_students: students.rows[0].count,
    total_teachers: teachers.rows[0].count,
    total_staff: staff.rows[0].count
  })
})

module.exports = router
