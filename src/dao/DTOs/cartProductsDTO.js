export default class cartProductsDTO{
    constructor(product){
        this.name = product.name,
        this.price = product.price,
        this.thumbnail = product.thumbnail,
        this.quantity = product.quantity,
        this.id = product.id
    }
}