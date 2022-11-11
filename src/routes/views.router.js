import  { Router } from 'express';
import pino from "pino"
import __dirname from '../utils.js';
const streams = [{level:'info',stream:process.stdout},{level:'warn',stream:pino.destination(__dirname + '/warn.log')},{level:'error',stream:pino.destination(__dirname+'/error.log')}]
const logger = pino({},pino.multistream(streams))

const router = Router();

router.get('/register',(req,res)=>{
    logger.info(`Coneccion recibida en ' /register ' con metodo GET`)
    res.render('register');
})
router.get('/login',(req,res)=>{
    logger.info(`Coneccion recibida en ' /login ' con metodo GET`)
    res.render('login')
})
router.get('/home',async(req,res)=>{
    logger.info(`Coneccion recibida en ' /Home ' con metodo GET`)
    if(!req.session.user){
     res.render('error',{mensaje:"Credenciales Invalidas"})
    }else{
        res.redirect('/')
    }
})
router.get('/profile',async(req,res)=>{
    logger.info(`Coneccion recibida en ' /profile ' con metodo GET`)
    let user = req.session.user
    if(!req.session.user) res.redirect('/')
    else res.render('data',{user})
})
router.get('/logout',(req,res)=>{
    logger.info(`Coneccion recibida en ' /logout ' con metodo GET`)
    if(!req.session.user) return res.redirect('/login')
    req.session.destroy()
    res.redirect('/')
})
export default router;