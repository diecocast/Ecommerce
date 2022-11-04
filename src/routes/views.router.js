import  { Router } from 'express';
import io from '../app.js';

const router = Router();

router.get('/register',(req,res)=>{
    res.render('register');
})
router.get('/login',(req,res)=>{
    res.render('login')
})
router.get('/home',async(req,res)=>{
    if(!req.session.user){
     res.render('error',{mensaje:"Credenciales Invalidas"})
    }else{
        res.redirect('/')
    }
})
router.get('/profile',async(req,res)=>{
    let user = req.session.user
    if(!req.session.user) res.redirect('/')
    else res.render('data',{user})
})
router.get('/logout',(req,res)=>{
    if(!req.session.user) return res.redirect('/login')
    req.session.destroy()
    res.redirect('/')
})
export default router;