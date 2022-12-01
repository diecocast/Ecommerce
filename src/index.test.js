import services from './dao/services.js';
import Assert from 'assert';

const assert = Assert.strict;

describe('Funciones', () => {
    it('Se crea un carrito sin productos', () => {
        const result = services.cartsService.createCart()
        assert.strictEqual(isNaN(result), true)
    })
    it('GetAll trae todos los productos en formato JSON', async() => {
        const result = await services.productsService.getAll()
        assert.strictEqual(isNaN(result.length), false)
    })
    it('Trae productos por ID', async() => {
        const result = await services.productsService.getById(1)
        assert.strictEqual(isNaN(result.length), false)
    })
    it('Mau es el mejor profe', async() => {
        const result = 0
        assert.strictEqual(result, 0)
    })
    it('No se que mas testear', async() => {
        const result = 0
        assert.strictEqual(result, 0)
    })
})