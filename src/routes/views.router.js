import  { Router } from 'express';
import viewsController from '../controllers/views.controller.js';

const router = Router();

router.get('/',viewsController.home)

router.get('/register',viewsController.register);

router.get('/login',viewsController.login);

router.get('/home',viewsController.current);

router.get('/profile',viewsController.profile);

router.get('/logout',viewsController.logout);


export default router;