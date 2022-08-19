import { ResultWithContext } from "express-validator/src/chain/index.js";
import jwt from "jsonwebtoken";

export const generateToken = (uid) => {
    const expiresIn = 60 * 15;


    try {
       const token = jwt.sign({uid}, process.env.JWT_SECRET, {expiresIn});
       return {token, expiresIn};
    } catch (error) {
        console.log(error);
    }
};
    
export const generateRefreshToken = (uid, res) => {
    const expiresIn = 60 * 60 * 24 * 30
    try {
        const refreshToken = jwt.sign({uid}, process.env.JWT_REFRESH, {expiresIn})
        res.cookie("refreshToken", refreshToken , {
            httpOnly: true,
            secure:!(process.env.modo ==="developer"),
            expires: new Date(Date.now() + expiresIn * 1000)
        });

    } catch (error) {
       console.log(error) 
    }

}

export const tokenVerificationErrors = {
    "invalid signature": "La firma de JWT no es valida",
    "JWT Expired": "JWT expirado",
    "Invalid Token": "Token Invalido",
    "No Bearer": "Utiliza Formato Bearer",
    "jwt malformed": "JWT Formato no valido"
};