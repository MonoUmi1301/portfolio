const express = require('express')
const cors = require('cors')
const path = require('path')
const db = require('./database')
const nodemailer = require('nodemailer')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, '../frontend')))

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

//เลือกดึงจากตาราง projects
app.get('/api/projects', (req, res) => {
    const projects = db.prepare('SELECT * FROM projects').all()
    res.json(projects)
})

app.get('/api/other-works', (req, res) => {
    const otherWorks = db.prepare('SELECT * FROM other_works').all()
    res.json(otherWorks)
})

app.get('/api/skills', (req, res) => {
    const skills = db.prepare('SELECT * FROM skills').all()
    res.json(skills)
})

app.get('/api/messages', (req, res) => {
    const messages = db.prepare('SELECT * FROM messages ORDER BY created_at DESC').all()
    res.json(messages)
})

app.post('/api/skills', (req, res) => {
    const data = req.body;
    const insert = db.prepare(
        'INSERT INTO skills (name, level, category, icon_url) VALUES (?, ?, ?, ?)'
    );
    try {
        if (Array.isArray(data)) {
            const insertMany = db.transaction((skills) => {
                for (const s of skills) {
                    insert.run(s.name, s.level, s.category, s.icon_url);
                }
            });
            insertMany(data);
            res.json({ message: `บันทึกข้อมูลสำเร็จ ${data.length} รายการ` });
        } else {
            const result = insert.run(data.name, data.level, data.category, data.icon_url);
            res.json({ id: result.lastInsertRowid, message: 'บันทึกข้อมูลสำเร็จ 1 รายการ' });
        }
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล', details: err.message });
    }
});

app.post('/api/projects', (req, res) => {
    const { title, description, image_url, github_url, live_url } = req.body
    const result = db.prepare(
        'INSERT INTO projects (title, description, image_url, github_url, live_url) VALUES (?, ?, ?, ?, ?)'
    ).run(title, description, image_url, github_url, live_url)
    res.json({ id: result.lastInsertRowid })
})

app.post('/api/other-works', (req, res) => {
    const { title, description, image_url, file_url } = req.body
    const result = db.prepare(
        'INSERT INTO other_works (title, description, image_url, file_url) VALUES (?, ?, ?, ?)'
    ).run(title, description, image_url, file_url)
    res.json({ id: result.lastInsertRowid })
})

//ส่งเข้าไปในตาราง messages ของ ฐานข้อมูล
// ใช้ ? เพื่อให้อ่านค่าที่ส่งมาเป็นข้อความเท่านั้น ไม่ให้รันคำสั่ง SQL ได้ เผื่อโดนแฮกเกอร์ส่งเข้ามา
app.post('/api/messages', async (req, res) => {
    const { name, email, message } = req.body
    const result = db.prepare('INSERT INTO messages (name, email, message) VALUES (?, ?, ?)').run(name, email, message)

    // ส่งอีเมลแจ้งเตือน
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: `📩 New message from ${name}`,
            html: `
        <h3>New contact form submission</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b> ${message}</p>
      `
        })
    } catch (err) {
        console.error('Email error:', err)
    }

    res.json({ id: result.lastInsertRowid })
})

app.delete('/api/projects/:id', (req, res) => {
    const { id } = req.params
    db.prepare('DELETE FROM projects WHERE id = ?').run(id)
    res.json({ message: 'Deleted successfully' })
})

app.delete('/api/other-works/:id', (req, res) => {
    const { id } = req.params
    db.prepare('DELETE FROM other_works WHERE id = ?').run(id)
    res.json({ message: 'Deleted successfully' })
})

app.put('/api/projects/:id', (req, res) => {
    const { id } = req.params
    const { title, description, image_url, github_url, live_url } = req.body
    db.prepare('UPDATE projects SET title = ?, description = ?, image_url = ?, github_url = ?, live_url = ? WHERE id = ?')
        .run(title, description, image_url, github_url, live_url, id)
    res.json({ message: 'Updated successfully' })
})

app.put('/api/other-works/:id', (req, res) => {
    const { id } = req.params
    const { title, description, image_url, file_url } = req.body
    db.prepare('UPDATE other_works SET title = ?, description = ?, image_url = ?, file_url = ? WHERE id = ?')
        .run(title, description, image_url, file_url, id)
    res.json({ message: 'Updated successfully' })
})

const PORT = process.env.PORT || 1301
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`)
})