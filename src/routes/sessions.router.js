import {Router} from 'express';
import passport from 'passport';
import sessionsController from '../controllers/sessions.controller.js';
const router = Router();

router.post('/register',passport.authenticate('register',{failureRedirect:'/api/sessions/registerfail'}),sessionsController.register);
router.post('/login',passport.authenticate('login',{failureRedirect:'/api/sessions/loginfail'}),sessionsController.login);
router.get('/loginfail',sessionsController.loginfail);

export default router;