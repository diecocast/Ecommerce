import passport from "passport";
import local from 'passport-local'
import services from "../dao/index.js";
import { measureMemory } from "vm";
import userService from "../models/User.js";
import { createHash,isValidPassword } from '../utils.js';
const LocalStrategy = local.Strategy

const initializePassport = () =>{

    passport.use('register',new LocalStrategy({passReqToCallback:true,usernameField:"email"},
    async(req,email,password,done)=>{
        const {name,address,age,phone_number,photo} = req.body;
        if(!name||!email||!password) return done(null,false,{message:"Incomplete values"})
        const exists = await userService.findOne({email:email});
        if(exists) return done(null,false,{message:"Incomplete values"})
        let cartID = await services.cartsService.createCart()
        const newUser = {
            name,
            email,
            cartID,
            address,
            age,
            phone_number,
            photo,
            password:createHash(password)
        }
        let result = await userService.create(newUser);
        return done(null,result)
    }))

    passport.serializeUser((user,done)=>{
        done(null,user._id)
    })
    passport.deserializeUser(async(id,done)=>{
        let result = await userService.findOne({_id:id})
        return done(null,result)
    })
}

passport.use('login',new LocalStrategy({usernameField:'email'},async(email,password,done)=>{
    if(!email||!password) return done(null,false,{menssage:"incorrect credentioal"})
    let user = await userService.findOne({email:email})
    if(!user) return done(null,false,{menssage:"incorrect credentioal"})
    if(!isValidPassword(user,password)) return done(null,false,{menssage:"incorrect credentioal"})
    return done(null,user)
}))

export default initializePassport;