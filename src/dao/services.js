import MongoProducts from './MongoDAO/Products.js'
import MongoCarts from './MongoDAO/Carts.js'

let productsService = new MongoProducts();
let cartsService = new MongoCarts();

const services = {
    productsService,
    cartsService
}
export default services
