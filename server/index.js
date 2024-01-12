const express = require('express')
const bodyparser = require('body-parser')
const app = express()

app.use(bodyparser.json())

const port = 8000

//สำหรับเก็บ users
let users = []
let counter = 1

/*
GET /users สำหรับ get users ทั้งหมดที่บันทึกเข้าไปออกมา
POST /users สำหรับการสร้าง users ใหม่บันทึกเข้าไป
GET /users/:id สำหรับการดึง users รายคนออกมา
PUT /users/:id สำหรับการแก้ไข users รายคน (ตาม id ที่บันทึกเข้าไป)
DELETE /users/:id สำหรับการลบ users รายคน (ตาม id ที่บันทึกเข้าไป)
*/

// path = GET /users สำหรับ get users ทั้งหมดที่บันทึกเข้าไปออกมา
app.get('/users', (req, res) => {
    const filterUsers = users.map(user => {
        return {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            fullname: user.firstname + ' ' + user.lastname
        }
    })
    res.json(filterUsers)
})

// path =  POST /users สำหรับการสร้าง users ใหม่บันทึกเข้าไป
app.post('/users', (req, res) => {
    let user = req.body
    user.id = counter
    counter += 1

    users.push(user)
    res.json({
        message: 'add ok',
        user: user
    })
})

// GET / users /:id สำหรับการดึง users รายคนออกมา
app.get('/users/:id', (req, res) => {
    let id = req.params.id

    //หา users จาก id ที่ส่งมา
    let selecntedIndex = users.findIndex(user => user.id == id)

    // หา index
    res.json(users[selecntedIndex])
})

// pant = PUT /users/:id สำหรับการแก้ไข users รายคน (ตาม id ที่บันทึกเข้าไป)
app.put('/users/:id', (req, res) => {
    let id = req.params.id
    let updeateUser = req.body

    //หา users จาก id ที่ส่งมา
    let selecntedIndex = users.findIndex(user => user.id == id)

    //updeate ช้อมูล users ,(null || 'ทดสอบ')
    // เราจะ updeate ด้วยค่าที่ส่งเข้ามา, แต่ถ้าค่าที่ส่งเข้ามาไม่มี เราจะใช้ค่าเดิมที่มีอยู่แล้ว โดยใช้ || 
    users[selecntedIndex].firstname = updeateUser.firstname || users[selecntedIndex].firstname
    users[selecntedIndex].lastname = updeateUser.lastname || users[selecntedIndex].lastname
    users[selecntedIndex].age = updeateUser.age || users[selecntedIndex].age
    users[selecntedIndex].gender = updeateUser.gender || users[selecntedIndex].gender

    res.json({
        message: 'updeate user complete!' ,
        data: {
            user: updeateUser,
            indexUpdate: selecntedIndex
        }
    })
    // res.send(selecntedIndex + '')
})

// path =DELETE /users/:id สำหรับการลบ users รายคน (ตาม id ที่บันทึกเข้าไป)
app.delete('/users/:id', (req, res) => {
    let id = req.params.id
    // ข้อแรก ให้หาก่อนว่าเราจะลบ index user ไหน
    let selecntedIndex = users.findIndex(user => user.id == id)
    //เจอก็ ลบ เลย !!!!
    
    users.splice(selecntedIndex, 1)

    res.json({
        message: 'delete complete',
        indexDelete: selecntedIndex
    })
})


app.listen(port, (req, res) => {    
    console.log('http server run at' + port)
})

// console.log('Hello worl')


// const express = require('express')
// const app = express()
// const bodyParser = require('body-parser')

// // Parse incoming JSON data
// app.use(bodyParser.json())

// // เราสร้างตัวแปร users ขึ้นมาเป็น Array จำลองการเก็บข้อมูลใน Server (ซึ่งของจริงจะเป็น database)
// let users = []

// // Route handler for creating a new user
// app.post('/user', (req, res) => {
//     const data = req.body

//     const newUser = {
//         firstname: data.firstname,
//         lastname: data.lastname,
//         age: data.age
//     }

//     //
//     users.push(newUser)

//     // Server ตอบกลับมาว่าเพิ่มแล้วเรียบร้อย
//     res.status(201).json({ message: 'User created successfully', user: newUser })
// })

// app.listen(8000, () => {
//     console.log('Server started on port 8000');
// })