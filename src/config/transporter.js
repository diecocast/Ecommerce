import nodemailer from 'nodemailer'
import config from "./config.js";
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: config.nodemailer.USER_NODEMAILER,
        pass: config.nodemailer.PASS_NODEMAILER
    }
});

export default transporter