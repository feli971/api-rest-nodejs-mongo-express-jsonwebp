import { Router } from 'express'
import {body} from 'express-validator'  
import { infoUser, login, register, refreshToken, logout } from '../controllers/auth.controller.js';
import { requireToken } from '../middlewares/requireToken.js';
import { validationResultExpress } from '../middlewares/validationResultExpress.js';


const router = Router();


router.post(
    "/register",
    [
        body('email',"Incorrect email format")
        .trim()
        .isEmail()
        .normalizeEmail(),
    body("password", "Minimo 6 caracteres")
        .trim()
        .isLength({ min : 6 }),
    body("password","Incorrect password format")
    .custom((value,{req}) => {
        if(value !== req.body.repassword){
            throw new Error('The passwords dont match')
        }
        return value;
    })
    ],
    validationResultExpress,
    register  
);

router.post(
    '/login',[
        body('email',"Incorrect email format")
        .trim()
        .isEmail()
        .normalizeEmail(),
        body("password", "Minimo 6 caracteres") .trim().isLength({ min : 6 }),    
    ],
    validationResultExpress,
    login
     
);

router.get("/protected", requireToken, infoUser );
router.get("/refresh", refreshToken)
router.get("/logout", logout)

export default router;