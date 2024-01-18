const express = require('express')
const bodyparser = require('body-parser')
const cors = require('cors')
const app = express()
const mysql = require('mysql2/promise')

app.use(bodyparser.json())
app.use(cors())

const port = 8000

// ใช้ตัวแปรผ่าน database แทน
let conn = null

const initMySQL = async () => {
    conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'tutorials'
    })
}

const valideteData = (userData) => {
    let errors = []

    if (!userData.firstname) {
        errors.push('กรุณาใส่ชื่อจริง')
    }

    if (!userData.lastname) {
        errors.push('กรุณาใส่นานสกุล')
    }

    if (!userData.age) {
        errors.push('กรุณาใส่อายุของคุณ')
    }

    if (!userData.gender) {
        errors.push('กรุณาใส่เพศ')
    }

    if (!userData.interests) {
        errors.push('กรุณาใส่ความสนใจ')
    }

    if (!userData.description) {
        errors.push('กรุณาใส่รายละเอียดเพิ่มเติมของคุณ')
    }

    return errors
}

/*
GET /users สำหรับ get users ทั้งหมดที่บันทึกเข้าไปออกมา
POST /users สำหรับการสร้าง users ใหม่บันทึกเข้าไป
GET /users/:id สำหรับการดึง users รายคนออกมา
PUT /users/:id สำหรับการแก้ไข users รายคน (ตาม id ที่บันทึกเข้าไป)
DELETE /users/:id สำหรับการลบ users รายคน (ตาม id ที่บันทึกเข้าไป)
*/

// path = GET /users สำหรับ get users ทั้งหมดที่บันทึกเข้าไปออกมา
app.get('/users', async (req, res) => {
    const results = await conn.query('SELECT * FROM users')
    res.json(results[0])
})

// path =  POST /users สำหรับการสร้าง users ใหม่บันทึกเข้าไป
app.post('/users', async (req, res) => {
    try {
        let user = req.body

        const errors = valideteData(user)
        if (errors.length > 0) {
            throw {
                message: 'กรอกข้อมูลไม่ครบ',
                errors: errors
            }
        }

        const results = await conn.query('INSERT INTO users SET ?', user)
        res.json({
            message: 'insert ok',
            deta: results[0]
        })
    }catch (error) {
        const errorMessage = error.message || 'something wrong'
        const errors = error.errors || []
        console.error('error message', error.message)
        res.status(500).json({
            message: errorMessage,
            errors: errors
        })
    }
})

// GET / users /:id สำหรับการดึง users รายคนออกมา
app.get('/users/:id',async (req, res) => {
    try{
        let id = req.params.id
        const results = await conn.query('SELECT * FROM users WHERE id = ?', id)

        if (results[0].length == 0) {
            throw { statusCode: 404, message: 'หาไม่เจอ ไม่มี ไม่รู้อยู่ไหน'}
        } 

        res.json(results[0][0])
    }catch (error) {
        console.error('error message', error.message)
        let statusCode = error.statusCode || 500
        res.status(500).json({
            message: 'something wrong',
            errorMessage: error.message
        })
    } 
})

// pant = PUT /users/:id สำหรับการแก้ไข users รายคน (ตาม id ที่บันทึกเข้าไป)
app.put('/users/:id', async (req, res) => { 
   try {
        let id = req.params.id
        let updeateUser = req.body
        const results = await conn.query(
            'UPDATE users SET ? WHERE id = ?', 
            [updeateUser, id]
        )
        res.json({
            message: 'updeate ok',
            deta: results[0]
        })
    } catch (error) {
        console.error('error message', error.message)
        res.status(500).json({
            message: 'something wrong',
        })
    }
})

// path =DELETE /users/:id สำหรับการลบ users รายคน (ตาม id ที่บันทึกเข้าไป)
app.delete('/users/:id', async (req, res) => {
    try {
        let id = req.params.id
        let updeateUser = req.body
        const results = await conn.query(
            'DELETE from users WHERE id = ?', id)
        res.json({
            message: 'delete ok',
            deta: results[0]
        })
    } catch (error) {
        console.error('error message', error.message)
        res.status(500).json({
            message: 'something wrong',
        })
    }
})

// เหตุผลที่ต้องไส่ await, async คือเพราะ function ก็ต้องใช้  await, async เหมือนกัน เพราะในนี้เลยต้องรอจนกว่า initMySQL จนเสร็จถึงจะไปต่อได้ 
app.listen(port, async (req, res) => {    
    await initMySQL()
    console.log('http server run at' + port)
})