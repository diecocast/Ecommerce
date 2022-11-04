import dotenv from 'dotenv'
dotenv.config()

export default {
    app:{
        MODE:process.env.MODE || 'PROD',
        PORT:process.env.PORT || 3000,
        DEBUG:process.env.DEBUG || false
    },
    mongo:{
    MONGO_URL: process.env.MONGO_URL,
    SESSION_MOGNO_URL: process.env.SESSION_MOGNO_URL,
    SESSION_SECRET:process.env.SESSION_SECRET
    },
    nodemailer:{
        USER_NODEMAILER: process.env.USER_NODEMAILER,
        PASS_NODEMAILER: process.env.PASS_NODEMAILER
    }

}