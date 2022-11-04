import mongoose from "mongoose";
import MongoDBContainer from "./mongoDBContainer.js";
import MongoProducts from './Products.js'
import __dirname from '../../utils.js'
import pino from "pino";
import nodemailer from 'nodemailer'
import transporter from "../../config/transporter.js";
const streams = [{level:'info',stream:process.stdout},{level:'warn',stream:pino.destination(__dirname + '/warn.log')},{level:'error',stream:pino.destination(__dirname+'/error.log')}]
const logger = pino({},pino.multistream(streams))
let productsService = new MongoProducts();

const collections = 'carts'
const productsSchema = mongoose.Schema({
    id:Number,
    timestamp:String,
    products:[]

})

export default class Carts extends MongoDBContainer{
    constructor(){
        super(collections,productsSchema)
    }
    getCartProducts = async(cid) =>{
        try {
            let data1 = await productsService.getAll()
            let data = JSON.parse(data1)
            let countQuantity = await this.model.find({id:cid},{_id:0,products:{product:1,quantity:1}})
            let numberQuantity = JSON.parse(JSON.stringify(countQuantity))
            let productsArr = numberQuantity[0].products
            let list = []
            Object.values(productsArr).forEach((pid) => {
                let productos = data.find((element) => element.id == pid.product)
                if(!productos) return ''
                productos.quantity = pid.quantity
                list.push(productos)
            })
            return list
        } catch (error) {
            logger.error(`Hay un error ${error}`)
            return `Hay un error o se a mandaod un producto invalido`
        }
    }
    createCart = async() =>{
        try {
            let producto = {}
            let datenow = new Date();
            function generateDatabaseDateTime(date) {
            return date.toISOString().replace("T"," ").substring(0, 19);
            }

            if(await this.model.countDocuments() ===0){
                producto.id= 1;
                producto.timestamp= generateDatabaseDateTime(datenow);
                producto.products=[];
                await this.model.insertMany(producto);
                return producto.id

            }else{
                let id = await this.model.find({},{id:1,_id:0}).sort({id:-1}).limit(1)
                producto.id = id[0].id+1
                producto.timestamp= generateDatabaseDateTime(datenow);
                producto.products=[];
                await this.model.insertMany(producto);
                return `${producto.id}`
            }
        } catch (error) {
            logger.error(`Hay un error ${error}`)
            return "Hay un error o no has creado tu cart"
        }
    }
    addProduct = async(info) =>{
        try {
            let existe = await this.model.countDocuments({id:info.cid,'products.product':info.pid})
            if(existe >= 1){
                let countQuantity = await this.model.find({id:info.cid,'products.product':info.pid},{_id:0,products:{product:1,quantity:1}})
                let numberQuantity = JSON.parse(JSON.stringify(countQuantity))
                let productsArr = numberQuantity[0].products
                productsArr.map(function(dato){
                  if(dato.product == info.pid){
                      dato.quantity = dato.quantity+1;
                  }})
                  await this.model.updateMany({id:info.cid,'products.product':info.pid},{$set:{products:productsArr}})
                return `Al producto ${info.pid} se le agrego la cantidad`
            }else{
            await this.model.updateMany({id:info.cid},{$push:{products:{product:info.pid,quantity:1}}})
            return `El producto ${info.pid} fue agregado con exito`
            }
        } catch (error) {
            logger.error(`Hay un error ${error}`)
            return `Hay un error, o el carrito o el producto puesto no existen. Recuerde el modo de añadir "http://localhost:8080/api/carts/:IDPRODCUT/products/:IDCART"`
        }

    }
    deleteByCidAndPid = async(info) =>{
        try {
            let countQuantity = await this.model.find({id:info.cid,'products.product':info.pid},{_id:0,products:{product:1,quantity:1}})
            let numberQuantity = JSON.parse(JSON.stringify(countQuantity))
            let productsArr = numberQuantity[0].products
            let productsList = Object.values(productsArr).filter((item) => item.product != info.pid);
            await this.model.updateMany({id:info.cid,'products.product':info.pid},{$set:{products:productsList}})
            return `Se elimino exitosamente`;
        } catch (error) {
            logger.error(`Hay un error ${error}`)
            return `Hay un error o se a mandaod un producto invalido`
        }
    }
    endShop = async(user,cid) =>{
        try{
        let products = await this.getCartProducts(cid)
        let total = await this.getTotal(cid)
        let mensageData = ''
        for(let i = 0;i<=products.length-1;i++){
            mensageData = mensageData+ `<li>${products[i].name }, Cantidad ${products[i].quantity}, Precio por unidad ${products[i].price}</li>`
        }
        
            let sendemail = await transporter.sendMail({
                from: "Ecommerse", // sender address
                to: user.email, // list of receivers
                subject: `Nuevo pedido de ${user.name}, ${user.email}`, // Subject line
                text:mensageData, // plain text body
                html: `<p>Usted compro lo siguiente</p><ol>${mensageData}</ol><h1>Total: ${total} dolares</h1>` // html body
              });
            return sendemail
        }catch(error){
            logger.error(`Hay un error ${error}`)
            return `Hay un error o tu gmail no es valido`
        }
    }

    getTotal = async(cid) =>{
        try {
            let products = await this.getCartProducts(cid)
            let total = 0
            for(let i = 0;i<=products.length-1;i++){
                total = total + products[i].price*products[i].quantity
            }
            return total
        } catch (error) {
            logger.error(`Hay un error ${error}`)
            return `Hay un error ${error}`
        }
    }
    
}