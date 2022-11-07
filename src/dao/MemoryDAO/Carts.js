import MemoryContainer from "./MemoryContainer.js";
import MemProducts from './Products.js'
import __dirname from '../../utils.js'
import pino from "pino";

const streams = [{level:'info',stream:process.stdout},{level:'warn',stream:pino.destination(__dirname + '/warn.log')},{level:'error',stream:pino.destination(__dirname+'/error.log')}]
const logger = pino({},pino.multistream(streams))
export default class Products extends MemoryContainer{
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
                return producto.id

            }else{
                producto.id = lista[lista.length-1].id+1
                producto.timestamp= generateDatabaseDateTime(datenow);
                producto.products=[];
                lista.push(producto)
                return `${producto.id}`
            }
        } catch (error) {
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
                    return "Se agrego 1 a la cantidad del producto ya que estaba agregado"
            } 
        } catch (error) {
            return `Hay un error, o el carrito o el producto puesto no existen. Recuerde el modo de añadir "https://ecommerce-production-0be9.up.railway.app/api/carts/:IDPRODCUT/products/:IDCART"`
        }

    }
    getCartProducts = async(cid)=>{

        try {
            let product = await this.getById(cid)
            let listproducts = Object.values(product.products)
            return listproducts
        
        } catch (error) {
            return `Hay un error o se a mandaod un producto invalido`
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
            this.data = data
            return `Se elimino exitosamente`;
        } catch (error) {
            return `Hay un error o se a mandaod un producto invalido`
        }
    }

}