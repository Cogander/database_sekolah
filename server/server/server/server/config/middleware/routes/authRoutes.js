const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const pool = require("../config/db")

const router = express.Router()

// ==============================
// 🔐 REGISTER USER
// ==============================
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body

    // Validasi dasar
    if (!username || !password) {
      return res.status(400).json({
        message: "Username dan password wajib diisi"
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password minimal 6 karakter"
      })
    }

    // Cek apakah user sudah ada
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    )

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message: "Username sudah digunakan"
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Insert ke database
    await pool.query(
      "INSERT INTO users (username, password, role) VALUES ($1,$2,$3)",
      [username, hashedPassword, "user"]
    )

    res.status(201).json({
      message: "User berhasil dibuat"
    })

  } catch (error) {
    console.error("Register Error:", error)
    res.status(500).json({
      message: "Terjadi kesalahan server"
    })
  }
})


// ==============================
// 🔑 LOGIN USER
// ==============================
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({
        message: "Username dan password wajib diisi"
      })
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Username tidak ditemukan"
      })
    }

    const user = result.rows[0]

    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
      return res.status(401).json({
        message: "Password salah"
      })
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h"
      }
    )

    res.status(200).json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    })

  } catch (error) {
    console.error("Login Error:", error)
    res.status(500).json({
      message: "Terjadi kesalahan server"
    })
  }
})


// ==============================
// 🔍 GET CURRENT USER (Protected)
// ==============================
router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({ message: "Token tidak ditemukan" })
    }

    const token = authHeader.split(" ")[1]

    const verified = jwt.verify(token, process.env.JWT_SECRET)

    const result = await pool.query(
      "SELECT id, username, role FROM users WHERE id=$1",
      [verified.id]
    )

    res.json(result.rows[0])

  } catch (error) {
    res.status(401).json({ message: "Token tidak valid" })
  }
})

module.exports = router
