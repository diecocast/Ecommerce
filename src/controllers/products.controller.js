import services from "../dao/services.js";
import __dirname from "../utils.js";
import io from '../app.js';
import pino from "pino"


const streams = [
    {level:'info',stream:process.stdout},
    {level:'warn',stream:pino.destination(__dirname + '/warn.log')},
    {level:'error',stream:pino.destination(__dirname+'/error.log')}
]
const logger = pino({},pino.multistream(streams))
const admin = true;

const home = async(req,res)=>{
    if(!req.session.user){ 
        return res.redirect('/login')
    }

    logger.info(`Coneccion recibida en ' /api/products/ ' con metodo GET`)
    let products= await services.productsService.getAll()
    res.send(products)
}

const getById = async(req,res)=>{
    if(!req.session.user){ 
        return res.redirect('/login')
    }

    logger.info(`Coneccion recibida en ' /api/products/pid ' con metodo GET`)
    let number = req.query.pid
    let productid = await services.productsService.getById(number)
    res.send(productid)
}

const newProduct = async(req,res)=>{
    if(!req.session.user){
        return res.redirect('/login')
    }
    
    if(admin==!true){ 
        return res.status(401).send("No estas autorizado")
    }

    logger.info(`Coneccion recibida en ' /api/products/ ' con metodo POST`)
    let producto = req.body
    await services.productsService.save(producto)
    let products = await services.productsService.getAll()
    let datos = JSON.parse(products)
    datos.push({cartID:req.session.user.cartID})
    io.emit('lista',datos)
    res.send({status:"succes", message:"Product Added"})
}

const update = async(req,res)=>{
    if(!req.session.user){ 
        return res.redirect('/login')
    }

    if(admin==!true) {
        return res.status(401).send("No estas autorizado")
    }

   logger.info(`Coneccion recibida en ' /api/products/ ' con metodo PUT`)
   let product = req.body
   await services.productsService.update(product)
   let products = await services.productsService.getAll()
   let datos = JSON.parse(products)
   datos.push({cartID:req.session.user.cartID})
   io.emit('lista',datos)
   res.send({status:"succes", message:"Product Update"})
}

const deleteProduct = async(req,res)=>{
    if(!req.session.user){ 
        return res.redirect('/login')
    }

    if(admin==!true) {
        return res.status(401).send("No estas autorizado")
    }

   logger.info(`Coneccion recibida en ' /api/products/ ' con metodo DELETE`)
   let id = req.body
   await services.productsService.deleteById(id.delete)
   let products = await services.productsService.getAll()
   let datos = JSON.parse(products)
   io.emit('lista',datos)
   res.send({status:"succes", message:"Product Delete"})
}

export default{
    home,
    getById,
    newProduct,
    update,
    deleteProduct
}