import {Router} from 'express';
import productsController from '../controllers/products.controller.js';
const router = Router();

router.get('/',productsController.home);

router.get('/pid',productsController.getById);

router.post('/',productsController.newProduct);

router.put('/',productsController.update);

router.delete('/',productsController.deleteProduct);


export default router;