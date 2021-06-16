require('dotenv').config()
const mongoose = require('mongoose')
const {userModel} = require('../models/users')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const saltRounds = 10

const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`
let password1 =''
let password2 = ''

let connection = null

let adduser = async() => {
    try {
        password1 = await bcrypt.hash( `${process.env.PASSWORD1}`,saltRounds)
        password2 = await bcrypt.hash(`${process.env.PASSWORD2}`,saltRounds)

    } catch (error) {
        
    }

    let data = [
        {
            user: 'admin',
            email: `${process.env.EMAIL1}`,
            role: 'admin',
            hash: password1,
          },
        {
            user: 'lingy',
            email: `${process.env.EMAIL2}`,
            role: 'user',
            hash: password2,
        }]
    mongoose.connect( mongoURI, { useNewUrlParser: true, useUnifiedTopology: true } )
  .then(connResp => {
    connection = connResp
    
    return userModel.insertMany(data)
  })
  .then(insertResp => {
      console.log('successful user data insertion')
  })
  .catch(err => {
    console.log(err)
  })
  .finally(() => {
    if (connection !== null) {
        connection.disconnect()
    }
})
}
adduser()
