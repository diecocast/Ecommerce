import express, { json } from "express";
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js";
import config from "./config/config.js";
import pino from "pino"
import sessionsRouter from "./routes/sessions.router.js"
import services from "./dao/index.js";
import homeRouter from "./routes/views.router.js"
import session from 'express-session';
import MongoStore from 'connect-mongo';
import initializePassport from './config/possport.config.js'
import passport from 'passport';
import { Server } from "socket.io";
import os from 'os'
import cluster from 'cluster'
import { resourceUsage } from "process";

const CPUs = os.cpus().length
const streams = [{level:'info',stream:process.stdout},{level:'warn',stream:pino.destination(__dirname + '/warn.log')},{level:'error',stream:pino.destination(__dirname+'/error.log')}]
const logger = pino({},pino.multistream(streams))
const PORT = config.app.PORT || 8080
const app = express()
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.engine('handlebars',handlebars.engine());
app.set('views',__dirname+'/views');
app.set('view engine','handlebars')
app.use(session({
    secret:config.mongo.SESSION_SECRET,
    store: MongoStore.create({
        mongoUrl:config.mongo.SESSION_MOGNO_URL,
        ttl:600
    }),
    resave:false,
    saveUninitialized:false
}))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())
const server = app.listen(PORT,()=>{console.log(`Escuchando en el puerto ${PORT}`)})
const io = new Server(server);



app.use('/',homeRouter)
app.use('/api/sessions',sessionsRouter);
app.use('/api/products',productsRouter);
app.use('/api/carts',cartsRouter);

app.get('/',async(req,res)=>{
    try {
        if(!req.session.user) return res.redirect('/login')
        let user = req.session.user
        let listCart = await services.cartsService.getCartProducts(req.session.user.cartID)
        let total = await services.cartsService.getTotal(user.cartID)
        let endShop = `    <form class="endshopForm"action="http://localhost:8080" method="post">
        <button id="endshop" class="endshop" formaction="/api/carts/endshop">Finalizar compra</button>
        </form>
    `
        if(listCart.length ==0){
            endShop = '<p>No tienes productos agregados</p>'
            res.render("viewHome",{user,listCart,endShop,total})
        }else{ 
            res.render("viewHome",{user,listCart,endShop,total})}
        io.on('connection',async(socket)=>{
            let products = await services.productsService.getAll()
            let datos = JSON.parse(products)
            datos.push({cartID:user.cartID})
            io.emit('lista',datos)
        
        })    
    } catch (error) {
        logger.error(`Hay un error ${error}`)
    }
   
})

app.get('*',(req,res)=>{
    if(req.path === '/favicon.ico') return ''
    logger.warn(`Intentaron ir de forma inesacta a  ${req.path}`)
    res.send("404 no existe")
})
export default io;