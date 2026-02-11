require('dotenv').config()
const bcrypt = require('bcrypt')
const pool = require('./config/db')

async function seed() {

  const hashed = await bcrypt.hash("k@mb0j@PLG351", 12)

  await pool.query(
    "INSERT INTO users (username, password, role) VALUES ($1,$2,$3)",
    ["admin", hashed, "admin"]
  )

  for (let i = 1; i <= 653; i++) {
    await pool.query(
      "INSERT INTO students (name,class,nis) VALUES ($1,$2,$3)",
      [`Siswa ${i}`, `Kelas ${Math.ceil(i/30)}`, `NIS${1000+i}`]
    )
  }

  for (let i = 1; i <= 108; i++) {
    await pool.query(
      "INSERT INTO teachers (name,subject) VALUES ($1,$2)",
      [`Guru ${i}`, `Mapel ${i}`]
    )
  }

  for (let i = 1; i <= 78; i++) {
    await pool.query(
      "INSERT INTO staff (name,position) VALUES ($1,$2)",
      [`Pengurus ${i}`, `Jabatan ${i}`]
    )
  }

  console.log("Database seeded successfully")
  process.exit()
}

seed()
