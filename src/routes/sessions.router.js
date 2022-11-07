import {Router} from 'express';
import passport from 'passport';
import transporter from '../config/transporter.js';
import __dirname from '../utils.js';
import config from '../config/config.js';
import pino from "pino"
const streams = [{level:'info',stream:process.stdout},{level:'warn',stream:pino.destination(__dirname + '/warn.log')},{level:'error',stream:pino.destination(__dirname+'/error.log')}]
const logger = pino({},pino.multistream(streams))
const router = Router();

router.post('/register',passport.authenticate('register',{failureRedirect:'/api/sessions/registerfail'}),async (req,res)=>{
    try {
        await transporter.sendMail({
            from: "AdminEcommerce", 
            to: config.nodemailer.USER_NODEMAILER, 
            subject: `Nuevo Registro a tu pagina`, 
            text:`Se registro un nuevo usuario: Name: ${req.user.name},Email: ${req.user.email},Number: ${req.user.phone_number}, Addres: ${req.user.address}` , 
            html: `<p>Se registro un nuevo usuario: <h4>Name: ${req.user.name}</h4><br><h4>Email: ${req.user.email}</h4><br><h4>Number: ${req.user.phone_number}</h4><br><h4>Addres: ${req.user.address}</h4></p>` // html body
          });
        logger.info(`New register`)
        res.send({status:"succes",payload:req.user._id})
    } catch (error) {
        logger.error(`Hay un error ${error}`)
    }
})
router.get('/registerfail',(req,res)=>{
    res.send({status:'error',payload:'Ya estas regsitrado'})
})
router.post('/login',passport.authenticate('login',{failureRedirect:'/api/sessions/loginfail'}),async(req,res)=>{
    try {
        req.session.user = {
            name:req.user.name,
            email:req.user.email,
            cartID:req.user.cartID,
            address:req.user.address,
            age:req.user.age,
            phone_number:req.user.phone_number,
            photo:req.user.photo,
            id:req.user._id}
    res.send({status:'succes',payload:req.session.user})
    } catch (error) {
    logger.error(`Hay un error ${error}`)
}})

router.get('/loginfail',(req,res)=>{
   res.status(500).send({status:"error",error:"Login fail rute"})

})
export default router;