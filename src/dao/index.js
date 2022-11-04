
const persistence  = "MONGO";

let productsService;
let cartsService;
switch(persistence){
    case "MEMORY":
        const {default:MemProducts} = await import('./MemoryDAO/Products.js');
        const {default:MemCarts} = await import('./MemoryDAO/Carts.js')
        productsService = new MemProducts()
        cartsService = new MemCarts()
        break;
    case "MONGO":
        const {default:MongoProducts} = await import('./MongoDAO/Products.js')
        const {default:MongoCarts} = await import('./MongoDAO/Carts.js')
        productsService = new MongoProducts();
        cartsService = new MongoCarts()
        break;
    case "FS":
        const {default:FileProducts} = await import('./FilesDAO/Products.js')
        const {default:FileCarts} = await import('./FilesDAO/Carts.js')
        productsService = new FileProducts();
        cartsService = new FileCarts()
        break;
}

const services = {
    productsService,
    cartsService
}
export default services
