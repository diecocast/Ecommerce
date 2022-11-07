import {Router} from 'express';
import services from "../dao/index.js";
import pino from "pino"
import __dirname from "../utils.js";
import io from '../app.js';
const streams = [{level:'info',stream:process.stdout},{level:'warn',stream:pino.destination(__dirname + '/warn.log')},{level:'error',stream:pino.destination(__dirname+'/error.log')}]
const logger = pino({},pino.multistream(streams))
const router = Router();

router.get('/:cid/products',async(req,res)=>{
   if(!req.session.user) return res.redirect('/login')
   logger.info(`Coneccion recibida en ' /api/carts/:cid/products ' con metodo GET`)
   let cid = req.params.cid
   if(isNaN(cid)) return res.status(400).send({error:"El valor no es numerico"})
   if(parseInt(cid)<1) return res.status(404).send("No hay un carro con ese id")
   let list = await services.cartsService.getCartProducts(cid)
   res.send(list)
})

router.post('/',async(req,res)=>{
   if(!req.session.user) return res.redirect('/login')
   logger.info(`Coneccion recibida en ' /api/carts/ ' con metodo POST`)
   let create = await services.cartsService.createCart()
   res.send(`El id de su carrito es ${create}`)
})
router.post('/products/:pid',async(req,res)=>{
   if(!req.session.user) return res.redirect('/login')
   logger.info(`Coneccion recibida en ' /api/cartsproducts/:pid ' con metodo POST`)
   let info = {pid:req.params.pid,cid:req.session.user.cartID}
   if(isNaN(info.pid)) return res.status(400).send({error:"El valor no es numerico o no existe"})
   await services.cartsService.addProduct(info)
   let list = await services.cartsService.getCartProducts(req.session.user.cartID)
   io.emit('cart',list)
   res.redirect('/')
})


router.delete('/:cid',async(req,res)=>{
   if(!req.session.user) return res.redirect('/login')
   logger.info(`Coneccion recibida en ' /api/carts/:cid ' con metodo DELETE`)
   let cid = req.params.cid
   if(isNaN(cid)) return res.status(400).send({error:"El valor no es numerico"})
   await services.cartsService.deleteById(cid)
   res.send(`Carrito ${cid} eliminado con exito`)
})

router.post('/delete/:pid',async(req,res)=>{
   if(!req.session.user) return res.redirect('/login')
   logger.info(`Coneccion recibida en ' /api/carts/delete/:pid ' con metodo DELETE`)
   let cid = {pid:req.params.pid,cid:req.session.user.cartID}
   if(isNaN(cid.cid)) return res.status(400).send({error:"El valor no es numerico"})
   let deleten = await services.cartsService.deleteByCidAndPid(cid)
   res.redirect('/')
})

router.post('/endshop',async(req,res)=>{
   if(!req.session.user) return res.redirect('/login')
   logger.info(`Coneccion recibida en ' /api/carts/endshop ' con metodo post`)
   try {
      let user = req.session.user
      let result = await services.cartsService.endShop(req.session.user,req.session.user.cartID)
      res.render('endShop',{user})
   } catch (error) {
      logger.error(`Hay un error ${error}`)
   }
})


export default router;