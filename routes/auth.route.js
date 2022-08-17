import express from 'express'
import { login, register } from '../controllers/auth.controller.js';
import {body} from 'express-validator' 
import { validationResultExpress } from '../middlewares/validationResultExpress.js';


const router = express.Router();


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


export default router;