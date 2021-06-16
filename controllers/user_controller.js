const bcrypt = require('bcrypt')
const saltRounds = 10
const userServices = require('../services/user_services')
const mailjetServices = require('../services/mailjet_services')

module.exports = {
    login: (req,res) => {
        res.render('users/login')
    },
    signup: (req,res) => {
        res.render('users/signup')
    },
    create: async(req,res) => {
        //ensure password matches
        if(req.body.password !== req.body.confirm_password){
            res.redirect('/users/signup')
            return
        }
        // validate if form is empty
        if (!req.body.password || !req.body.confirm_password || !req.body.user || !req.body.email) {
            res.redirect('/users/signup')
            return
        }

        let user = null
        user = await userServices.findUserByEmail(req,res)
 
        //return if user email already used
        if (user) {
            res.redirect('/users/signup')
            return
        }

        const createdUser = await userServices.createUser(req,res)
        const sendAccountCreated = await mailjetServices.sendAccountCreated(req,res)

        res.redirect('/eats')
    },
    
    loginUser: async(req,res) => {
        let user = null
        user = await userServices.findUserByUser(req,res)

        if (!user) {
            res.redirect('/users/signup')
            return
        }

        const isValidPassword = await bcrypt.compare(req.body.password, user.hash)
        if (!isValidPassword) {
            res.redirect('/users/login')
            return
        }
        
        req.session.user = user

        res.redirect('/eats')
        
    },
    logout: (req, res) => {
        req.session.destroy()
        res.redirect('/users/login')
    },
    forgetpassword: (req,res) => {
        res.render('users/forgetpassword')
    },
    sendResetEmail: async(req,res) => {
        let user = null
        user = await userServices.findUserByEmail(req,res)

        if(user !== null) {
            const sendResetEmail = await mailjetServices.sendResetEmail(req,res,user)
        }else{
            res.redirect('/users/forgetpassword')
            return
        }
        res.redirect('/users/login')
    },
    resetpassword: async(req,res) => {
        let id = req.params.id
        let user = null
        user = await userServices.findUserByID(req,res)

        if(!user){
            res.redirect('users/forgetpassword')
            return
        }

        res.render('users/resetpassword',{id:id})
    },

    updateUserPassword: async(req,res) => {
        let id = req.params.id
        console.log(id)
        let password = ''

        if(req.body.password === req.body.confirm_password) {
            const user = await userServices.updateUserByID(req,res,id)
        }else{
            res.redirect('/users/forgetpassword/'+id)
            return
        }
        // need to add what happens if password not updated
        res.redirect('/users/login')
        
    }
}
