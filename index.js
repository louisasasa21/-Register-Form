const BASE_URL = 'http://localhost:8000'

let mode = 'CREATE' // default
let selectedId = ''

window.onload = async () => {
    // นำ parameter ทั้งหมดมาใส่ตัวแปร urlParams
    const urlParams = new URLSearchParams(window.location.search)
    // ดึง id ออกมาจาก parameter
    const id = urlParams.get('id')
    console.log('id', id)
    if (id) {
        mode = 'EDIT',
        selectedId = id

        // 1.เราจะดึงข้อมูล user เก่าออกมาก่อน
        try {
            const response = await axios.get(`${BASE_URL}/users/${id}`)
            const user = response.data


            // 2.เราจะนำข้อมูล user กลับใส่ดข้าใน input html
            let firsNameDOM = document.querySelector('input[name=firsname]')
            let lastNameDOM = document.querySelector('input[name=lastname]')
            let ageDOM = document.querySelector('input[name=age]')
            let descriptionDOM = document.querySelector('textarea[name=description]')

            firsNameDOM.value = user.firstname
            lastNameDOM.value = user.lastname
            ageDOM.value = user.age
            descriptionDOM.value = user.description

            let genderDOMs = document.querySelectorAll('input[name=gender]')
            let interestDOMs = document.querySelectorAll('input[name=interest]')

            for (let i = 0; i < genderDOMs.length; i++) {
                if (genderDOMs[i].value == user.gender) {
                    genderDOMs[i].checked = true
                }
            }

            for (let i = 0; i < interestDOMs.length; i++) {
                if (user.interests.includes(interestDOMs[i].value)) {
                    interestDOMs[i].checked = true
                }
            }

        } catch (error) {
            console.log('error', error)
        }
    }
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

const submitData = async () => {
    let firsNameDOM = document.querySelector('input[name=firsname]')
    let lastNameDOM = document.querySelector('input[name=lastname]')
    let ageDOM = document.querySelector('input[name=age]')

    let genderDOM = document.querySelector('input[name=gender]:checked') || {}
    let interestDOMs = document.querySelectorAll('input[name=interest]:checked') || {}

    let descriptionDOM = document.querySelector('textarea[name=description]')

    let messageDOM = document.getElementById('message')

    try {
        let interest = ''

        for (let i = 0; i < interestDOMs.length; i++) {
            interest += interestDOMs[i].value
            if (i != interestDOMs.length - 1) {
                interest += ', '
            }
        }

        let userData = {
            firstname: firsNameDOM.value,
            lastname: lastNameDOM.value,
            age: ageDOM.value,
            gender: genderDOM.value,
            description: descriptionDOM.value,
            interests: interest 
        }

        console.log('submit Data', userData)

        const errors = valideteData(userData)

        if (errors.length > 0) {
            // มี error  เกิดขึ้น
            throw {
                message: 'กรอกข้อมูลไม่ครบ',
                errors: errors
            }
        }

        let message = 'บันทึกข้อมูลเรียบร้อย'
    
        if (mode == 'CREATE') {
            const response = await axios.post(`${BASE_URL}/users`, userData)
            console.log('response', response.data)
        } else {
            const response = await axios.put(`${BASE_URL}/users/${selectedId}`, userData)
            message = 'แก้ไขข้อมูลเรียบร้อย'
            console.log('response', response.data)
        }
        
        console.log('response', response.data)

        messageDOM.innerText = message
        messageDOM.className = 'message success'

    } catch (error) {
        console.log('error message', error.message)
        console.log('error', error.errors)
        if (error.response) {
            console.log(error.response)
            error.message = error.response.data.message
            error.errors = error.response.data.errors
        }

        let htmlData = '<div>'
        htmlData += `<div>${error.message}</div>`
        htmlData += '<ul>'

        for (let i = 0; i < error.errors.length; i++) {
            htmlData += `<li>${error.errors[i]}</li>`
        }
        htmlData += '</div>'

        messageDOM.innerHTML = htmlData
        messageDOM.className = 'message danger'
    }   
}
    
