import FileContainer from './FileContainer.js'
import pino from "pino"
import __dirname from '../../utils.js'


const streams = [{level:'info',stream:process.stdout},{level:'warn',stream:pino.destination(__dirname + '/warn.log')},{level:'error',stream:pino.destination(__dirname+'/error.log')}]
const logger = pino({},pino.multistream(streams))
const {default:FileProducts} = await import('./Products.js')
import fs from 'fs'

const productsService = new FileProducts();
const path = './files/carts.json'

export default class Carts extends FileContainer{
    constructor(){
        super(path)
    }
    update = async(obj,cid) =>{
        try {
            let arr = await this.getAll()
            let products = obj.products;
            let id = cid.cid
            arr.map(function(dato){
                if(dato.id == id){
    
                    dato.products = products
                }
            })
            await fs.promises.writeFile(path,JSON.stringify(arr,null,'\t'));
        } catch (error) {
            logger.error(`Hay un error ${error}`)
            return `Hay un error o se a mandaod un producto invalido`
        }
       
    }

    getCartProducts = async(cid)=>{

        try {
            let data = await productsService.getAll();
            let product = await this.getById(cid)
            let list= [];
            console.log("product.products : " , Object.values(product.products))
            Object.values(product.products).forEach((pid) => {
            let productos = data.find((element) => element.id == pid.product)
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
            let lista = await this.getAll();
            if(lista.length===0){
                producto.id= 1;
                producto.timestamp= generateDatabaseDateTime(datenow);
                producto.products=[];
                lista.push(producto);
                await fs.promises.writeFile(path,JSON.stringify(lista,null,'\t'));
                return producto.id

            }else{
                producto.id = lista[lista.length-1].id+1
                producto.timestamp= generateDatabaseDateTime(datenow);
                producto.products=[];
                lista.push(producto)
                await fs.promises.writeFile(path,JSON.stringify(lista,null,'\t'))
                return `${producto.id}`
            }
        } catch (error) {
            logger.error(`Hay un error ${error}`)
            return "Hay un error o no has creado tu cart"
        }
    }
    addProduct = async(info) =>{
        try {
            let arr = await this.getAll()
            let product = await this.getById(info.cid)
            let productsList = Object.values(product.products).find(obj => obj.product == info.pid)
            const productsInCartsFound = product.products
            const ProductItemInCarts = productsInCartsFound.find(item=> item.id === parseInt(info.pid))
    
            if(!productsList){
                  arr.map(function(dato){
                    if(dato.id == info.cid){
                      dato.products.push({product:info.pid,quantity:1})
                    }
                    fs.promises.writeFile(path,JSON.stringify(arr,null,'\t'));
                })
                return "Producto Agregado"
            }else{ 
                const newProduct = {
                    product: info.pid,
                    quantity: productsList.quantity+1,
                  }
                  product.products.push(newProduct)
                  await this.update(product,info)
                  let deleteOld = Object.values(product.products).filter((item) => item != productsList);
                  arr.map(function(dato){
                    if(dato.id == info.cid){
                        dato.products = deleteOld;
                    }})
                    await fs.promises.writeFile(path,JSON.stringify(arr,null,'\t'));
                    return "Se agrego 1 a la cantidad del producto ya que estaba agregado"
            } 
        } catch (error) {
            logger.error(`Hay un error ${error}`)
            return `Hay un error, o el carrito o el producto puesto no existen. Recuerde el modo de añadir "http://localhost:8080/api/carts/:IDPRODCUT/products/:IDCART"`
        }

    }
    deleteByCidAndPid = async(info) =>{
        try {
            const data = await this.getAll();
            let product = await this.getById(info.cid)
            let productsList = Object.values(product.products).filter((item) => item.product != info.pid);
            data.map(function(dato){
                        if(dato.id == info.cid){
                            dato.products = productsList
                        }})
            await fs.promises.writeFile(path,JSON.stringify(data,null,'\t'));
            return `Se elimino exitosamente`;
        } catch (error) {
            logger.error(`Hay un error ${error}`)
            return `Hay un error o se a mandaod un producto invalido`
        }
    }
}