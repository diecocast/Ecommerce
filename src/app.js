import express from "express";
import MongoStore from 'connect-mongo';
import passport from 'passport';
import session from 'express-session';
import handlebars from "express-handlebars";
import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js";
import sessionsRouter from "./routes/sessions.router.js"
import viewsRouter from "./routes/views.router.js"
import config from "./config/config.js";
import __dirname from "./utils.js";
import initializePassport from './config/possport.config.js'
import { Server } from "socket.io";

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

const server = app.listen(PORT,()=>{
    console.log(`Lisening on ${PORT}`)
})

const io = new Server(server);

app.use('/',viewsRouter)
app.use('/api/sessions',sessionsRouter);
app.use('/api/products',productsRouter);
app.use('/api/carts',cartsRouter);

export default io;