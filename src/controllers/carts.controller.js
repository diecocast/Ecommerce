import services from "../dao/index.js";
import pino from "pino"
import __dirname from "../utils.js";
import io from '../app.js';

const streams = [
    {level:'info',stream:process.stdout},
    {level:'warn',stream:pino.destination(__dirname + '/warn.log')},
    {level:'error',stream:pino.destination(__dirname+'/error.log')}
]
const logger = pino({},pino.multistream(streams))

const getCartProducts = async(req,res)=>{
   if(!req.session.user){ 
      return res.redirect('/login')
   }

   let cid = req.params.cid
   if(isNaN(cid)){ 
      return res.status(400).send({error:"El valor no es numerico"})
   }

   if(parseInt(cid)<1){ 
      return res.status(404).send("No hay un carro con ese id")
   }

   logger.info(`Coneccion recibida en ' /api/carts/:cid/products ' con metodo GET`)
   let list = await services.cartsService.getCartProducts(cid)
   res.send(list)
}

const createCart = async(req,res)=>{
   if(!req.session.user){ 
      return res.redirect('/login')
   }

   logger.info(`Coneccion recibida en ' /api/carts/ ' con metodo POST`)
   let create = await services.cartsService.createCart()
   res.send(`El id de su carrito es ${create}`)
}

const addProduct = async(req,res)=>{
   if(!req.session.user){ 
      return res.redirect('/login')
   }

   let info = {pid:req.params.pid,cid:req.session.user.cartID}
   if(isNaN(info.pid)){
      return res.status(400).send({error:"El valor no es numerico o no existe"})
   }

   logger.info(`Coneccion recibida en ' /api/cartsproducts/:pid ' con metodo POST`)
   await services.cartsService.addProduct(info)
   let list = await services.cartsService.getCartProducts(req.session.user.cartID)
   io.emit('cart',list)
   res.redirect('/')
}

const deleteCart = async(req,res)=>{
   if(!req.session.user){ 
      return res.redirect('/login')
   }

   let cid = req.params.cid
   if(isNaN(cid)){ 
      return res.status(400).send({error:"El valor no es numerico"})
   }

   logger.info(`Coneccion recibida en ' /api/carts/:cid ' con metodo DELETE`)
   await services.cartsService.deleteById(cid)
   res.send(`Carrito ${cid} eliminado con exito`)
}

const deleteProduct = async(req,res)=>{
   if(!req.session.user){ 
      return res.redirect('/login')
   }

   let cid = {pid:req.params.pid,cid:req.session.user.cartID}
   if(isNaN(cid.cid)){ 
      return res.status(400).send({error:"El valor no es numerico"})
   }

   logger.info(`Coneccion recibida en ' /api/carts/delete/:pid ' con metodo DELETE`)
   await services.cartsService.deleteByCidAndPid(cid)
   res.redirect('/')
}

const endshop = async(req,res)=>{
   if(!req.session.user){ 
      return res.redirect('/login')
   }
   
   logger.info(`Coneccion recibida en ' /api/carts/endshop ' con metodo post`)
   try {
      let user = req.session.user
      await services.cartsService.endShop(req.session.user,req.session.user.cartID)
      res.render('endShop',{user})
      
   } catch (error) {
      logger.error(`Hay un error ${error}`)
   }
}

export default{
    getCartProducts,
    createCart,
    addProduct,
    deleteCart,
    deleteProduct,
    endshop
}